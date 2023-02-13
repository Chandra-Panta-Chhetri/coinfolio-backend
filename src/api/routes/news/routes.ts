import { Router } from "express";
import { celebrate } from "celebrate";
import * as newsReqSchemas from "./req-schemas";
import * as newsController from "./controller";
import rl from "express-rate-limit";

const newsRouter = Router();

export default (app: Router) => {
  app.use("/news", newsRouter);

  newsRouter.get(
    "/",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(newsReqSchemas.GET_NEWS),
    newsController.getNews
  );
};
