import { NextFunction, Request, Response } from "express";
import CurrencyService from "../../../services/currency";

export const getCurrencies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currencies = await CurrencyService.getCurrencies(req.query);
    res.send(currencies);
  } catch (err) {
    next(err);
  }
};
