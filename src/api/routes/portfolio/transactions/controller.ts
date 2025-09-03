import { NextFunction, Request, Response } from "express";
import ERROR_MESSAGES from "../../../../constants/error-messages";
import { ErrorType } from "../../../../enums/error";
import ErrorService from "../../../../services/error";
import PortfolioService from "../../../../services/portfolio";
import PTransactionService from "../../../../services/portfolio/transaction";

export const addTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioId = req.params.portfolioId;
    const user = req.user!;
    const hasAccess = await PortfolioService.hasAccess(user, portfolioId);
    if (!hasAccess) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const newTransaction = await PTransactionService.addToPortfolio(portfolioId, req.body);
    const newTransactionDTO = PTransactionService.toTransactionDTO(newTransaction);
    res.send(newTransactionDTO);
  } catch (err) {
    next(err);
  }
};

export const deleteTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioId = req.params.portfolioId;
    const user = req.user!;
    const hasAccess = await PortfolioService.hasAccess(user, portfolioId);
    if (!hasAccess) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const deletedTransactions = await PTransactionService.deleteMany(portfolioId, req.query);
    const deletedTransactionsDTO = PTransactionService.toTransactionDTOs(deletedTransactions);
    res.send(deletedTransactionsDTO);
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioId = req.params.portfolioId;
    const user = req.user!;
    const hasAccess = await PortfolioService.hasAccess(user, portfolioId);
    if (!hasAccess) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const transactions = await PTransactionService.getMany(portfolioId, req.query);
    const transactionsDTO = PTransactionService.toTransactionDTOs(transactions);
    res.send(transactionsDTO);
  } catch (err) {
    next(err);
  }
};

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioId = req.params.portfolioId;
    const user = req.user!;
    const hasAccess = await PortfolioService.hasAccess(user, portfolioId);
    if (!hasAccess) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const transaction = await PTransactionService.getById(portfolioId, req.params.id);
    const transactionDTO = PTransactionService.toTransactionDTO(transaction);
    res.send(transactionDTO);
  } catch (err) {
    next(err);
  }
};

export const updateTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioId = req.params.portfolioId;
    const user = req.user!;
    const hasAccess = await PortfolioService.hasAccess(user, portfolioId);
    if (!hasAccess) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const updatedTransaction = await PTransactionService.updateById(portfolioId, req.params.id, req.body);
    const updatedTransactionDTO = PTransactionService.toTransactionDTO(updatedTransaction);
    res.send(updatedTransactionDTO);
  } catch (err) {
    next(err);
  }
};

export const deleteTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioId = req.params.portfolioId;
    const user = req.user!;
    const hasAccess = await PortfolioService.hasAccess(user, portfolioId);
    if (!hasAccess) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const deletedTransaction = await PTransactionService.deleteOne(portfolioId, req.params.id);
    const deletedTransactionDTO = PTransactionService.toTransactionDTO(deletedTransaction);
    res.send(deletedTransactionDTO);
  } catch (err) {
    next(err);
  }
};
