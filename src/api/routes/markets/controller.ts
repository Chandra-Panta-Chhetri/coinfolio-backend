import { NextFunction, Request, Response } from "express";
import MarketsService from "../../../services/markets";

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  const ms = new MarketsService();
  const summaryRes = await ms.getSummary();
  const summary = ms.toSummaryDTO(summaryRes);
  res.send(summary);
};
