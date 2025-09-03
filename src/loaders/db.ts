import config from "../config";
import knex from "knex";

const db = knex({
  client: "pg",
  connection: config.db
});

export default db;
