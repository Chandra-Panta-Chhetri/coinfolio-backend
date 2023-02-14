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
import { IPortfolioTransaction, IPortfolioTransactionType } from "../../interfaces/IPortfolio";
import { IRequestUser } from "../../interfaces/IUser";
import db from "../../loaders/db";
import CoinMapService from "../coin-map";
import ErrorService from "../error";
import MarketService from "../market";

export default class PTransactionService {
  constructor() {}

  private static async deleteWhere(criteria: Partial<IPortfolioTransaction>) {
    const deletedTransactions = await db(TABLE_NAMES.PORTFOLIO_TRANSACTIONS)
      .del()
      .where(criteria)
      .returning<IPortfolioTransaction[]>("*");
    return deletedTransactions;
  }

  private static async findWhere(criteria: Partial<IPortfolioTransaction>) {
    const transactions = await db
      .select<IPortfolioTransaction[]>("*")
      .from(TABLE_NAMES.PORTFOLIO_TRANSACTIONS)
      .where(criteria);
    return transactions;
  }

  private static async updateWhere(update: Partial<IPortfolioTransaction>, criteria: Partial<IPortfolioTransaction>) {
    const updatedTransactions = await db(TABLE_NAMES.PORTFOLIO_TRANSACTIONS)
      .update(update)
      .where(criteria)
      .returning<IPortfolioTransaction[]>("*");
    return updatedTransactions;
  }

  static async getById(user: IRequestUser, portfolioId: string, id: string) {
    await PortfolioService.getByID(user, portfolioId);
    const [transaction] = await this.findWhere({ portfolio_id: +portfolioId, id: +id });
    if (transaction === undefined) {
      throw new ErrorService(ErrorType.NotFound, `Transaction with id ${id} does not exist`);
    }
    return transaction;
  }

  static async getMany(user: IRequestUser, portfolioId: string, query: IGetPTransactionsQuery) {
    await PortfolioService.getByID(user, portfolioId);
    const searchCriteria: Partial<IPortfolioTransaction> = {};
    if (query.coin_id !== undefined) {
      searchCriteria.coincap_id = query.coin_id;
    }
    searchCriteria.portfolio_id = +portfolioId;
    const transactions = await this.findWhere(searchCriteria);
    return transactions;
  }

  static async deleteMany(user: IRequestUser, portfolioId: string, criteria: IDeletePTransactionsQuery) {
    const portfolio = await PortfolioService.getByID(user, portfolioId);
    const deleteCriteria: Partial<IPortfolioTransaction> = {};
    if (criteria.coin_id !== undefined) {
      deleteCriteria.coincap_id = criteria.coin_id;
    }
    const deletedTransactions = await this.deleteWhere({
      ...deleteCriteria,
      portfolio_id: +portfolioId
    });
    return deletedTransactions;
  }

  static async deleteOne(user: IRequestUser, portfolioId: string, id: string) {
    const portfolio = await PortfolioService.getByID(user, portfolioId);
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
    const portfolio = await PortfolioService.getByID(user, portfolioId);
    const mappedUpdates: Partial<IPortfolioTransaction> = {
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

  private static async create(transactions: Partial<IPortfolioTransaction> | Partial<IPortfolioTransaction>[]) {
    const createdTransactions = await db(TABLE_NAMES.PORTFOLIO_TRANSACTIONS)
      .insert(transactions)
      .returning<IPortfolioTransaction[]>("*");
    return createdTransactions;
  }

  static async addToPortfolio(user: IRequestUser, portfolioId: string, transaction: IAddPTransactionReqBody) {
    const portfolio = await PortfolioService.getByID(user, portfolioId);
    //or skip and try to insert, if error, most likely coinid wrong
    const idMap = await CoinMapService.getCorrespondingIds(transaction.coinId);
    const [createdTransaction] = await this.create({
      notes: transaction.notes,
      type: transaction.type as IPortfolioTransactionType,
      quantity: transaction.quantity,
      price_per_usd: transaction.pricePer,
      coincap_id: transaction.coinId,
      portfolio_id: +portfolioId
    });
    return createdTransaction;
  }
}
