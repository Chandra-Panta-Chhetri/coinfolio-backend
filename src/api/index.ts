import { Router } from "express";
import auth from "./routes/auth";
import news from "./routes/news";

export default () => {
  const app = Router();
  auth(app);
  news(app);
  return app;
};
