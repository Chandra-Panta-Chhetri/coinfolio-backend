import PortfolioService from ".";
import {
  IAddPTransactionReqBody,
  IDeletePTransactionsQuery
} from "../../api/routes/portfolio/transactions/req-schemas";
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
