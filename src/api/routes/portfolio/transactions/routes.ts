import { Router } from "express";
import { celebrate } from "celebrate";
import * as transactionReqSchemas from "./req-schemas";
import * as transactionController from "./controller";
import rl from "express-rate-limit";
import middlewares from "../../../middlewares";

const transactionRouter = Router({ mergeParams: true });

export default (app: Router) => {
  app.use("/portfolios/:portfolioId/transactions", transactionRouter);

  transactionRouter.delete(
    "/",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(transactionReqSchemas.DELETE_TRANSACTIONS),
    middlewares.isAuthenticated,
    transactionController.deleteTransactions
  );

  transactionRouter.post(
    "/",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(transactionReqSchemas.ADD_PORTFOLIO_TRANSACTION),
    middlewares.isAuthenticated,
    transactionController.addTransaction
  );
};
