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

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await PTransactionService.getMany(req.user!, req.params.portfolioId, req.query);
    res.send(transactions);
  } catch (err) {
    next(err);
  }
};

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await PTransactionService.getById(req.user!, req.params.portfolioId, req.params.id);
    res.send(transaction);
  } catch (err) {
    next(err);
  }
};
