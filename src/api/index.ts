import { Router } from "express";
import auth from "./routes/auth/routes";
import news from "./routes/news/routes";
import events from "./routes/events/routes";

export default () => {
  const app = Router();
  auth(app);
  news(app);
  events(app);
  return app;
};
