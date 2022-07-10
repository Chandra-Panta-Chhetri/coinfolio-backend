import { Router } from "express";
import { celebrate } from "celebrate";
import * as reqSchemas from "./req-schemas";
import * as newsController from "./controller";
import rl from "express-rate-limit";

const route = Router();

export default (app: Router) => {
  app.use("/news", route);

  route.get(
    "/",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(reqSchemas.GET_NEWS),
    newsController.index
  );
};
