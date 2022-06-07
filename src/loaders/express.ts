import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import routes from "../api";
import config from "../config";
import { isCelebrateError } from "celebrate";
import morgan from "morgan";
import { IReqValidationErr } from "../interfaces/IReqValidationErr";
import compression from "compression";
import { ErrorType } from "../enums/error";
import middlewares from "../api/middlewares";
import ErrorService from "../services/error";

export default async ({ app }: { app: express.Application }) => {
  app.enable("trust proxy");
  app.use(morgan("dev"));
  app.use(compression());
  app.use(cors());
  app.use(express.json());

  //Converts JWT token -> req.user
  app.use(middlewares.extractUserFromToken);

  app.use(config.api.prefix, routes());

  //Catches 404 api routes
  app.use(`${config.api.prefix}/*`, (req, res, next) => {
    throw new ErrorService(ErrorType.NotFound, `${req.method} request to ${req.originalUrl} does not exist!`);
  });

  //Handles celebrate errors
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!isCelebrateError(err)) {
      return next(err);
    }
    const error: IReqValidationErr = {};
    for (let e of err.details.keys()) {
      console.log(err.details.get(e)?.details);
      error[e] = err.details.get(e)!.details.map((d) => ({ key: d.context?.key!, message: d.message }));
    }
    return res.status(400).send(error);
  });

  //Handles generic errors
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.name, err.message);
    switch (err.name) {
      case ErrorType.Unauthorized:
        return res.status(401).send({ message: err.message });
      case ErrorType.Validation:
      case ErrorType.BadRequest:
        return res.status(400).send({ message: err.message });
      case ErrorType.NotFound:
        return res.status(404).send({ message: err.message });
      default:
        return res.status(500).send({ message: "Internal Server Error" });
    }
  });
};
