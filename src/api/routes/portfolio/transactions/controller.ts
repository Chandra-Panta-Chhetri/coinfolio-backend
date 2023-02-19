import { NextFunction, Request, Response } from "express";
import PTransactionService from "../../../../services/portfolio/transaction";

export const addTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newTransaction = await PTransactionService.addToPortfolio(req.user!, req.params.portfolioId, req.body);
    const newTransactionDTO = PTransactionService.toTransactionDTO(newTransaction);
    res.send(newTransactionDTO);
  } catch (err) {
    next(err);
  }
};

export const deleteTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedTransactions = await PTransactionService.deleteMany(req.user!, req.params.portfolioId!, req.query);
    const deletedTransactionsDTO = PTransactionService.toTransactionsDTO(deletedTransactions);
    res.send(deletedTransactionsDTO);
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await PTransactionService.getMany(req.user!, req.params.portfolioId, req.query);
    const transactionsDTO = PTransactionService.toTransactionsDTO(transactions);
    res.send(transactionsDTO);
  } catch (err) {
    next(err);
  }
};

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await PTransactionService.getById(req.user!, req.params.portfolioId, req.params.id);
    const transactionDTO = PTransactionService.toTransactionDTO(transaction);
    res.send(transactionDTO);
  } catch (err) {
    next(err);
  }
};

export const updateTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedTransaction = await PTransactionService.updateById(
      req.user!,
      req.params.portfolioId,
      req.params.id,
      req.body
    );
    const updatedTransactionDTO = PTransactionService.toTransactionDTO(updatedTransaction);
    res.send(updatedTransactionDTO);
  } catch (err) {
    next(err);
  }
};

export const deleteTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedTransaction = await PTransactionService.deleteOne(req.user!, req.params.portfolioId, req.params.id);
    const deletedTransactionDTO = PTransactionService.toTransactionDTO(deletedTransaction);
    res.send(deletedTransactionDTO);
  } catch (err) {
    next(err);
  }
};
