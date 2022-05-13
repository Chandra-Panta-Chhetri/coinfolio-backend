import { Router } from "express";
import * as marketsController from "./controller";
import rl from "express-rate-limit";
import { celebrate } from "celebrate";
import * as reqSchemas from "./req-schemas";

const route = Router();

export default (app: Router) => {
  app.use("/markets", route);

  route.get(
    "/",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(reqSchemas.GET_MARKETS),
    marketsController.getMarkets
  );

  route.get("/search", celebrate(reqSchemas.GET_ASSETS_BY_KEYWORD), marketsController.getAssetsByKeyword);

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
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(reqSchemas.GET_TOP_COINS),
    marketsController.getTopCoins
  );

  route.get(
    "/gainers-losers",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(reqSchemas.GET_GAINERS_LOSERS),
    marketsController.getGainersLosers
  );
};
