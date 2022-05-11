import { NextFunction, Request, Response } from "express";
import EventsService from "../../../services/events";

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  const es = new EventsService();
  const eventsRes = await es.getEvents(req.query);
  if ("error_code" in eventsRes) {
    return res.status(eventsRes.error_code).send({ message: eventsRes.error_message });
  }
  const events = es.toGetEventsDTO(eventsRes);
  res.send(events);
};
