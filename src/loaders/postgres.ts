import config from "../config";
import { Pool } from "pg";
import Logger from "./logger";

const pool = new Pool(config.postgres);

const connectToDb = async () => {
  try {
    await pool.connect();
  } catch (err) {
    Logger.error(err);
  }
};

export default {
  connectToDb,
  pool
};
