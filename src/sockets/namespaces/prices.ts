import { Namespace, Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import SocketClient from "ws";
import config from "../../config";
import { IPricesSocketData } from "../../interfaces/ISocket";
import { IObject } from "../../interfaces/IUtils";
import Logger from "../../loaders/logger";

const includeKeysOnly = (obj: IObject, commaSepKeys: string = ""): IObject => {
  if (Object.keys(obj).length === 0 || commaSepKeys === "ALL") {
    return obj;
  }

  const filteredObj: IObject = {};
  const keysToInclude = commaSepKeys.split(",");

  for (let key of keysToInclude) {
    if (obj[key] !== undefined) {
      filteredObj[key] = obj[key];
    }
  }

  return filteredObj;
};

export default (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  const pricesNamespace: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, IPricesSocketData> =
    io.of("/prices");

  const pricesSocket = new SocketClient(`${config.sockets.coinCap}/prices?assets=ALL`);

  pricesSocket.on("open", () => {
    Logger.info("Connected to CoinCap Prices Websocket");
  });

  pricesSocket.on("error", (err) => {
    Logger.error(`Failed to connect to CoinCap Prices Websocket ${err.message}`);
  });

  pricesNamespace.on("connection", (client) => {
    Logger.info(`New Client: ${client.id} ${client.handshake.query.assets}`);
    client.data.isPricesPaused = false;

    const onNewPrices = (data: SocketClient.RawData, isBinary: boolean) => {
      const message = isBinary ? {} : JSON.parse(data.toString());
      const prices = includeKeysOnly(message, client.handshake.query.assets as string);
      const hasNewPrices = Object.keys(prices).length >= 1;
      if (hasNewPrices && !client.data.isPricesPaused) {
        client.emit("new prices", prices);
      }
    };

    pricesSocket.on("message", onNewPrices);

    client.on("pause prices", () => {
      client.data.isPricesPaused = true;
      Logger.info(`Client ${client.id} Paused`);
    });

    client.on("resume prices", () => {
      client.data.isPricesPaused = false;
      Logger.info(`Client ${client.id} Resumed`);
    });

    client.on("disconnect", (reason) => {
      Logger.info(`Client ${client.id} Disconnected`);
      pricesSocket.removeListener("message", onNewPrices);
    });
  });
};
