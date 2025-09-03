import { NextFunction, Request, Response } from "express";
import EventService from "../../../services/event";

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await EventService.getEvents(req.query);
    const eventsDTO = EventService.toEventsDTO(events);
    res.send(eventsDTO);
  } catch (err) {
    next(err);
  }
};
