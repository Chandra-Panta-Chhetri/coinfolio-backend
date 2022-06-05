import config from "../config";
import postgres from "postgres";

const sql = postgres(config.postgres);

export default sql;
