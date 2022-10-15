import config from "./config";
import express from "express";
import Logger from "./loaders/logger";

async function startServer() {
  const app = express();

  await require("./loaders").default({ expressApp: app });

  app
    .listen(config.port, () => {
      Logger.info(`Server running on port ${config.port}`);
    })
    .on("error", (err) => {
      Logger.error(`Server failed to start ${config.port}`);
      process.exit(1);
    });
}

startServer();
