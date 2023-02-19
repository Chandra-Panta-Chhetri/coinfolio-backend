import express, { NextFunction, Request, Response, Application as ExpressApplication } from "express";
import cors from "cors";
import routes from "../api";
import config from "../config";
import { isCelebrateError } from "celebrate";
import morgan from "morgan";
import compression from "compression";
import { ErrorType } from "../enums/error";
import middlewares from "../api/middlewares";
import ErrorService from "../services/error";
import Logger from "./logger";
import ERROR_MESSAGES from "../constants/error-messages";
import swaggerUi from "swagger-ui-express";
import swaggerJson from "../config/swagger.json";

export default async (app: ExpressApplication) => {
  app.enable("trust proxy");
  app.use(morgan("dev"));
  app.use(compression());
  app.use(cors());
  app.use(express.json());

  //Converts JWT token -> req.user
  app.use(middlewares.extractUserFromToken);

  app.use(config.api.prefix, routes());
  app.use(config.api.docs, swaggerUi.serve, swaggerUi.setup(swaggerJson, { customSiteTitle: "CoinFolio API Docs" }));

  //Catches 404 routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ErrorService(ErrorType.NotFound, `${req.method} request to ${req.originalUrl} does not exist!`));
  });

  //Handles Celebrate errors
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!isCelebrateError(err)) {
      return next(err);
    }
    for (let e of err.details.keys()) {
      let errorMsg = err.details.get(e)!.details.map((d) => d.message)[0];
      return next(new ErrorService(ErrorType.BadRequest, errorMsg));
    }
  });

  //Handles generic errors
  app.use((err: ErrorService, req: Request, res: Response, next: NextFunction) => {
    if (err.statusCode !== undefined) {
      return res.status(err.statusCode).send({ message: err.message });
    }

    switch (err.name) {
      case ErrorType.Unauthorized:
      case ErrorType.Authorized:
        return res.status(401).send({ message: err.message });
      case ErrorType.Validation:
      case ErrorType.BadRequest:
      case ErrorType.Failed:
        return res.status(400).send({ message: err.message });
      case ErrorType.NotFound:
        return res.status(404).send({ message: err.message });
      default:
        return res.status(500).send({ message: ERROR_MESSAGES.SERVER });
    }
  });
};
