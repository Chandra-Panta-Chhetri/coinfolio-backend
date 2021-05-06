import express from "express";
import expressLoader from "./express";
import dbDataLoader from "./seed-db";
import postgresLoader from "./postgres";

export default async ({ expressApp }: { expressApp: express.Application }) => {
  await postgresLoader.connectToDb();
  await dbDataLoader();
  await expressLoader({ app: expressApp });
};
