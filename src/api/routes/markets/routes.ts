import { Router } from "express";
import * as marketsController from "./controller";
import rl from "express-rate-limit";
import { celebrate } from "celebrate";
import * as marketsReqSchemas from "./req-schemas";

const marketsRouter = Router();

export default (app: Router) => {
  app.use("/markets", marketsRouter);

  marketsRouter.get(
    "/",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(marketsReqSchemas.GET_MARKETS),
    marketsController.getMarkets
  );

  marketsRouter.get(
    "/:id/overview",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(marketsReqSchemas.GET_ASSET_OVERVIEW),
    marketsController.getAssetOverview
  );

  marketsRouter.get(
    "/:id/exchanges",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(marketsReqSchemas.GET_ASSET_EXCHANGES),
    marketsController.getAssetExchanges
  );

  marketsRouter.get(
    "/:id/about",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(marketsReqSchemas.GET_ASSET_ABOUT),
    marketsController.getAssetAbout
  );

  marketsRouter.get(
    "/search",
    celebrate(marketsReqSchemas.GET_ASSETS_BY_KEYWORD),
    marketsController.getAssetsByKeyword
  );

  marketsRouter.get(
    "/summary",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    marketsController.getSummary
  );

  marketsRouter.get(
    "/top-coins",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(marketsReqSchemas.GET_TOP_COINS),
    marketsController.getTopCoins
  );

  marketsRouter.get(
    "/gainers-losers",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(marketsReqSchemas.GET_GAINERS_LOSERS),
    marketsController.getGainersLosers
  );
};
