import config from "../config";
import postgres from "postgres";

const sql = postgres(config.db);

export default sql;
