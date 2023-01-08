import { Router } from "express";
import auth from "./routes/auth/routes";
import news from "./routes/news/routes";
import events from "./routes/events/routes";
import markets from "./routes/markets/routes";
import portfolio from "./routes/portfolio/routes";

export default () => {
  const app = Router();
  auth(app);
  news(app);
  events(app);
  markets(app);
  portfolio(app);

  return app;
};
