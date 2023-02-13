import { NextFunction, Request, Response } from "express";
import PTransactionService from "../../../../services/portfolio/transaction";

export const addTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newTransaction = await PTransactionService.addToPortfolio(req.user!, req.params.portfolioId, req.body);
    res.send(newTransaction);
  } catch (err) {
    next(err);
  }
};

export const deleteTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedTransactions = await PTransactionService.deleteMany(req.user!, req.params.portfolioId!, req.query);
    res.send(deletedTransactions);
  } catch (err) {
    next(err);
  }
};
