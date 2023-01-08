import { Router } from "express";
import { celebrate } from "celebrate";
import * as reqSchemas from "./req-schemas";
import * as portfolioController from "./controller";
import rl from "express-rate-limit";
import middlewares from "../../middlewares";

const route = Router();

export default (app: Router) => {
  app.use("/portfolios", route);

  route.get(
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

  route.post(
    "/",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(reqSchemas.CREATE_PORTFOLIO),
    middlewares.isAuthenticated,
    portfolioController.createPortfolio
  );

  route.get(
    "/:id",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(reqSchemas.GET_PORTFOLIO_BY_ID),
    middlewares.isAuthenticated,
    portfolioController.getPortfolioByID
  );

  route.put(
    "/:id",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(reqSchemas.UPDATE_PORTFOLIO_BY_ID),
    middlewares.isAuthenticated,
    portfolioController.updatePortfolioByID
  );

  route.delete(
    "/:id",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(reqSchemas.DELETE_PORTFOLIO_BY_ID),
    middlewares.isAuthenticated,
    portfolioController.deletePortfolioByID
  );
};
