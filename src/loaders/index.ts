import { Application as ExpressApplication } from "express";
import expressLoader from "./express";
import initalizeDB from "./initialize-db";
import "./events";
import Logger from "./logger";
import jobScheduler from "./job-scheduler";

export default async ({ expressApp }: { expressApp: ExpressApplication }) => {
  await initalizeDB();
  //await jobScheduler();
  await expressLoader({ app: expressApp });
};
