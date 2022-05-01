import { Router } from "express";
import * as marketsController from "./controller";
import rl from "express-rate-limit";

const route = Router();

export default (app: Router) => {
  app.use("/markets", route);

  route.get(
    "/summary",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    marketsController.getSummary
  );
};
