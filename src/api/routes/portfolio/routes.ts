import { Router } from "express";
import { celebrate } from "celebrate";
import * as portfolioReqSchemas from "./req-schemas";
import * as portfolioController from "./controller";
import rl from "express-rate-limit";
import middlewares from "../../middlewares";
import initTransactionRoutes from "./transactions/routes";

const portfolioRouter = Router();

export default (app: Router) => {
  app.use("/portfolios", portfolioRouter);

  portfolioRouter.get(
    "/",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    middlewares.isAuthenticated,
    portfolioController.getPortfolios
  );

  portfolioRouter.post(
    "/",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(portfolioReqSchemas.CREATE_PORTFOLIO),
    middlewares.isAuthenticated,
    portfolioController.createPortfolio
  );

  portfolioRouter.get(
    "/:id",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(portfolioReqSchemas.GET_PORTFOLIO_BY_ID),
    middlewares.isAuthenticated,
    portfolioController.getPortfolioByID
  );

  portfolioRouter.patch(
    "/:id",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(portfolioReqSchemas.UPDATE_PORTFOLIO_BY_ID),
    middlewares.isAuthenticated,
    portfolioController.updatePortfolioByID
  );

  portfolioRouter.delete(
    "/:id",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(portfolioReqSchemas.DELETE_PORTFOLIO_BY_ID),
    middlewares.isAuthenticated,
    portfolioController.deletePortfolioByID
  );

  portfolioRouter.get(
    "/:id/overview",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(portfolioReqSchemas.GET_PORTFOLIO_OVERVIEW),
    middlewares.isAuthenticated,
    portfolioController.getPortfolioOverview
  );

  initTransactionRoutes(app);
};
