import dotenv from "dotenv";
dotenv.config();

export default {
  port: parseInt(process.env.PORT || "5000"),
  api: {
    prefix: "/api"
  },
  env: process.env.NODE_ENV || "development",
  postgres: {
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    database: process.env.DB_NAME || "",
    password: process.env.DB_PASSWORD || "",
    port: parseInt(process.env.DB_PORT || "5432"),
    ssl:
      (process.env.NODE_ENV || "development") === "development"
        ? undefined
        : {
            rejectUnauthorized: false
          }
  },
  logs: {
    level: process.env.LOG_LEVEL || "silly"
  }
};
