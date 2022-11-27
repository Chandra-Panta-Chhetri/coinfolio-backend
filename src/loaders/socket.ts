import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import initializeNamespaces from "../sockets";

export default (server: HTTPServer) => {
  const io = new Server(server);
  initializeNamespaces(io);
  return io;
};
