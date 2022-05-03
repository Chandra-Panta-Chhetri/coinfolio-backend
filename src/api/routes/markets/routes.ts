import { Router } from "express";
import * as marketsController from "./controller";
import rl from "express-rate-limit";
import { celebrate } from "celebrate";
import * as reqSchemas from "./req-schemas";

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

  route.get(
    "/top-coins",
    celebrate(reqSchemas.GET_TOP_COINS),
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    marketsController.getTopCoins
  );

  route.get(
    "/gainers-losers",
    celebrate(reqSchemas.GET_GAINERS_LOSERS),
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    marketsController.getGainersLosers
  );
};
