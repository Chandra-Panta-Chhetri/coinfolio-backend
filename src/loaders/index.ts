import { Application as ExpressApplication } from "express";
import expressLoader from "./express";
import dbDataLoader from "./seed-db";
import "./events";
import Logger from "./logger";

export default async ({ expressApp }: { expressApp: ExpressApplication }) => {
  // await dbDataLoader();
  await expressLoader({ app: expressApp });
};
