import PortfolioService from ".";
import {
  IAddPTransactionReqBody,
  IDeletePTransactionsQuery,
  IGetPTransactionsQuery,
  IUpdatePTransactionReqBody
} from "../../api/routes/portfolio/transactions/req-schemas";
import { removeUndefinedProperties } from "../../api/utils";
import TABLE_NAMES from "../../constants/db-table-names";
import ERROR_MESSAGES from "../../constants/error-messages";
import { ErrorType } from "../../enums/error";
import { IPTransaction, IPTransactionDTO, IPTransactionType } from "../../interfaces/IPortfolio";
import { IRequestUser } from "../../interfaces/IUser";
import db from "../../loaders/db";
import CoinMapService from "../coin-map";
import ErrorService from "../error";
import MarketService from "../market";

export default class PTransactionService {
  constructor() {}

  private static async create(transactions: Partial<IPTransaction> | Partial<IPTransaction>[]) {
    try {
      const createdTransactions = await db(TABLE_NAMES.PORTFOLIO_TRANSACTIONS)
        .insert(transactions)
        .returning<IPTransaction[]>("*");
      return createdTransactions;
    } catch (err) {
      return [];
    }
  }

  private static async deleteWhere(criteria: Partial<IPTransaction>) {
    try {
      const deletedTransactions = await db(TABLE_NAMES.PORTFOLIO_TRANSACTIONS)
        .del()
        .where(criteria)
        .returning<IPTransaction[]>("*");
      return deletedTransactions;
    } catch (err) {
      return [];
    }
  }

  private static async findWhere(criteria: Partial<IPTransaction>) {
    try {
      const transactions = await db
        .select<IPTransaction[]>("*")
        .from(TABLE_NAMES.PORTFOLIO_TRANSACTIONS)
        .where(criteria);
      return transactions;
    } catch (err) {
      return [];
    }
  }

  private static async updateWhere(update: Partial<IPTransaction>, criteria: Partial<IPTransaction>) {
    try {
      const updatedTransactions = await db(TABLE_NAMES.PORTFOLIO_TRANSACTIONS)
        .update(update)
        .where(criteria)
        .returning<IPTransaction[]>("*");
      return updatedTransactions;
    } catch (err) {
      return [];
    }
  }

  private static async checkPermission(user: IRequestUser, portfolioId: string) {
    try {
      await PortfolioService.getByID(user, portfolioId);
      return true;
    } catch (err) {
      return false;
    }
  }

  static toTransactionDTO(transaction: IPTransaction): IPTransactionDTO {
    return {
      coinId: transaction.coincap_id,
      date: transaction.date,
      id: transaction.id,
      notes: transaction.notes,
      pricePerUSD: transaction.price_per_usd,
      quantity: transaction.quantity,
      type: transaction.type
    };
  }

  static toTransactionsDTO(transactions: IPTransaction[]): IPTransactionDTO[] {
    return transactions.map((t) => this.toTransactionDTO(t));
  }

  static async getById(user: IRequestUser, portfolioId: string, id: string) {
    const hasPermission = await this.checkPermission(user, portfolioId);
    if (!hasPermission) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const [transaction] = await this.findWhere({ portfolio_id: +portfolioId, id: +id });
    if (transaction === undefined) {
      throw new ErrorService(ErrorType.NotFound, `Transaction with id ${id} does not exist`);
    }
    return transaction;
  }

  static async getMany(user: IRequestUser, portfolioId: string, query: IGetPTransactionsQuery) {
    const hasPermission = await this.checkPermission(user, portfolioId);
    if (!hasPermission) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const mappedCriteria: Partial<IPTransaction> = {
      coincap_id: query.coinId,
      type: query.type,
      portfolio_id: +portfolioId
    };
    removeUndefinedProperties(mappedCriteria);
    const transactions = await this.findWhere(mappedCriteria);
    return transactions;
  }

  static async deleteMany(user: IRequestUser, portfolioId: string, criteria: IDeletePTransactionsQuery) {
    const hasPermission = await this.checkPermission(user, portfolioId);
    if (!hasPermission) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const mappedCriteria: Partial<IPTransaction> = {
      coincap_id: criteria.coinId,
      portfolio_id: +portfolioId
    };
    removeUndefinedProperties(mappedCriteria);
    const deletedTransactions = await this.deleteWhere(mappedCriteria);
    return deletedTransactions;
  }

  static async deleteOne(user: IRequestUser, portfolioId: string, id: string) {
    const hasPermission = await this.checkPermission(user, portfolioId);
    if (!hasPermission) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const [deletedTransaction] = await this.deleteWhere({
      id: +id,
      portfolio_id: +portfolioId
    });
    if (deletedTransaction === undefined) {
      throw new ErrorService(ErrorType.NotFound, `Transaction with id ${id} does not exist`);
    }
    return deletedTransaction;
  }

  static async updateById(user: IRequestUser, portfolioId: string, id: string, update: IUpdatePTransactionReqBody) {
    const hasPermission = await this.checkPermission(user, portfolioId);
    if (!hasPermission) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const mappedUpdates: Partial<IPTransaction> = {
      notes: update.notes,
      price_per_usd: update.pricePer,
      type: update.type,
      quantity: update.quantity
    };
    removeUndefinedProperties(mappedUpdates);
    const [updatedTransaction] = await this.updateWhere(mappedUpdates, { id: +id, portfolio_id: +portfolioId });
    if (updatedTransaction === undefined) {
      throw new ErrorService(ErrorType.NotFound, `Transaction with id ${id} does not exist`);
    }
    return updatedTransaction;
  }

  static async addToPortfolio(user: IRequestUser, portfolioId: string, transaction: IAddPTransactionReqBody) {
    const hasPermission = await this.checkPermission(user, portfolioId);
    if (!hasPermission) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const [createdTransaction] = await this.create({
      notes: transaction.notes,
      type: transaction.type as IPTransactionType,
      quantity: transaction.quantity,
      price_per_usd: transaction.pricePer,
      coincap_id: transaction.coinId,
      portfolio_id: +portfolioId
    });
    if (createdTransaction === undefined) {
      throw new ErrorService(ErrorType.BadRequest, "Failed to add transaction to portfolio");
    }
    return createdTransaction;
  }
}
