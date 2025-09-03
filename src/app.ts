import config from "./config";
import express from "express";
import Logger from "./loaders/logger";
import http from "http";

function startServer() {
  const app = express();
  const server = http.createServer(app);

  require("./loaders")
    .default(app, server)
    .then(() => {
      server
        .listen(config.port, () => {
          Logger.info(`Server running on port ${config.port}`);
        })
        .on("error", (err) => {
          Logger.error(`Server failed to start ${config.port}`);
          Logger.error(err.message);
          process.exit(1);
        });
    })
    .catch(() => {
      Logger.error(`Server failed to start ${config.port}`);
      process.exit(1);
    });
}

startServer();
