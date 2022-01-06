import config from "../config";
import { Pool } from "pg";

const pool = new Pool(config.postgres);

const connectToDb = async () => {
  try {
    await pool.connect();
  } catch (err) {
    console.log(err);
  }
};

export default {
  connectToDb,
  pool
};
