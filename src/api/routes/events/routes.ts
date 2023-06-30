import { Router } from "express";
import { celebrate } from "celebrate";
import * as eventsReqSchemas from "./req-schemas";
import * as eventsController from "./controller";
import rl from "express-rate-limit";

const eventsRouter = Router();

export default (app: Router) => {
  app.use("/events", eventsRouter);

  eventsRouter.get(
    "/",
    rl({
      windowMs: 1000,
      max: 5,
      legacyHeaders: false,
      standardHeaders: true
    }),
    celebrate(eventsReqSchemas.GET_EVENTS),
    eventsController.getEvents
  );
};
