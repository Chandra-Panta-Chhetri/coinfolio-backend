import { Router } from "express";
import { celebrate } from "celebrate";
import * as transactionReqSchemas from "./req-schemas";
import * as transactionController from "./controller";
import rl from "express-rate-limit";
import middlewares from "../../../middlewares";

const transactionRouter = Router({ mergeParams: true });

export default (app: Router) => {
  app.use("/portfolios/:portfolioId/transactions", transactionRouter);

  transactionRouter.get(
    "/",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(transactionReqSchemas.GET_TRANSACTIONS),
    middlewares.isAuthenticated,
    transactionController.getTransactions
  );

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

  transactionRouter.get(
    "/:id",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    middlewares.isAuthenticated,
    transactionController.getTransactionById
  );

  transactionRouter.put(
    "/:id",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(transactionReqSchemas.UPDATE_TRANSACTION_BY_ID),
    middlewares.isAuthenticated,
    transactionController.updateTransactionById
  );

  transactionRouter.delete(
    "/:id",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    middlewares.isAuthenticated,
    transactionController.deleteTransactionById
  );
};
