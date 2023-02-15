import { Application as ExpressApplication } from "express";
import expressLoader from "./express";
import dbLoader from "./seed-db";
// import "./events";
import jobsLoader from "./job-scheduler";
import socketLoader from "./socket";
import { Server as HTTPServer } from "http";

export default async (app: ExpressApplication, server: HTTPServer) => {
  //await dbLoader();
  //socketLoader(server);
  await expressLoader(app);
  //await jobsLoader();
};
