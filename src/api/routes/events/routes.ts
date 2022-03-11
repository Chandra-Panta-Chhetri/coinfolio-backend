import { Router } from "express";
import { celebrate } from "celebrate";
import * as reqSchemas from "./req-schemas";
import * as eventsController from "./controller";
import rl from "express-rate-limit";

const route = Router();

export default (app: Router) => {
  app.use("/events", route);

  route.get(
    "/",
    celebrate(reqSchemas.GET_EVENTS),
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    eventsController.index
  );
};
