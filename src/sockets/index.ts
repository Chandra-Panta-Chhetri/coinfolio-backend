import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import prices from "./namespaces/prices";

export default (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  prices(io);
};
