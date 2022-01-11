import { Router } from "express";
import auth from "./routes/auth/routes";
import news from "./routes/news/routes";

export default () => {
  const app = Router();
  auth(app);
  news(app);
  return app;
};
