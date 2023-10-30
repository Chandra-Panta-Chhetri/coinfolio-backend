import { Router } from "express";
import { celebrate } from "celebrate";
import * as currenciesController from "./controller";
import * as currenciesReqSchemas from "./req-schemas";

const currenciesRouter = Router();
export default (app: Router) => {
  app.use("/currencies", currenciesRouter);

  currenciesRouter.get("/", celebrate(currenciesReqSchemas.GET_CURRENCIES), currenciesController.getCurrencies);
  currenciesRouter.get(
    "/:currencyCode",
    celebrate(currenciesReqSchemas.GET_CURRENCY),
    currenciesController.getCurrency
  );
};
