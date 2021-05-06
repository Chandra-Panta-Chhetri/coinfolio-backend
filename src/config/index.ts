import dotenv from "dotenv";

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error(".env file not found");
}

export default {
  port: parseInt(process.env.PORT || "5000"),
  api: {
    prefix: "/api"
  },
  env: process.env.NODE_ENV || "development",
  postgresConfig: {
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    database: process.env.DB_NAME || "",
    password: process.env.DB_PASSWORD || "",
    port: parseInt(process.env.DB_PORT || "5432")
  }
};
