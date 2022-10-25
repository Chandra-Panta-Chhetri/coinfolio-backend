import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import SocketClient from "ws";
import config from "../../config";
import Logger from "../../loaders/logger";

export default (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  const pricesNamespace = io.of("/prices");

  const pricesSocket = new SocketClient(`${config.sockets.coinCap}/prices?assets=ALL`);

  pricesSocket.on("open", () => {
    Logger.info("Connected to CoinCap Prices Websocket");
  });

  pricesSocket.on("error", (err) => {
    Logger.error(`Failed to connect to CoinCap Prices Websocket ${err.message}`);
  });

  pricesNamespace.on("connection", (client) => {
    Logger.info(`New Client Connected: ${client.id}`);

    const onNewPrices = (data: SocketClient.RawData, isBinary: boolean) => {
      const message = isBinary ? data : data.toString();
      client.emit("new prices", message);
    };

    pricesSocket.on("message", onNewPrices);

    client.on("disconnect", (reason) => {
      Logger.info(`Client ${client.id} Disconnected`);
      pricesSocket.removeListener("message", onNewPrices);
    });
  });
};
