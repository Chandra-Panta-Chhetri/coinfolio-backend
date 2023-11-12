import {
  IAddPTransactionReqBody,
  IDeletePTransactionsQuery,
  IGetPTransactionsQuery,
  IUpdatePTransactionReqBody
} from "../../api/routes/portfolio/transactions/req-schemas";
import { removeUndefinedProperties } from "../../api/utils";
import TABLE_NAMES from "../../constants/db-table-names";
import { ErrorType } from "../../enums/error";
import { IPTransaction, IPTransactionDTO, IPTransactionType, IPortfolioHolding } from "../../interfaces/IPortfolio";
import db from "../../loaders/db";
import ErrorService from "../error";

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

  static toTransactionDTO(transaction: IPTransaction): IPTransactionDTO {
    return {
      coinId: transaction.coincap_id,
      date: transaction.date,
      id: +transaction.id,
      notes: transaction.notes,
      pricePer: `${Number(transaction.price_per)}`,
      quantity: `${Number(transaction.quantity)}`,
      type: transaction.type,
      currencyCode: transaction.currency_code,
      usdRate: transaction.usd_rate
    };
  }

  static toTransactionDTOs(transactions: IPTransaction[]): IPTransactionDTO[] {
    return transactions.map((t) => this.toTransactionDTO(t));
  }

  static async getById(portfolioId: string, id: string) {
    const [transaction] = await this.findWhere({ portfolio_id: +portfolioId, id: +id });
    if (transaction === undefined) {
      throw new ErrorService(ErrorType.NotFound, `Transaction with id ${id} does not exist`);
    }
    return transaction;
  }

  static async getMany(portfolioId: string, query: IGetPTransactionsQuery) {
    const mappedCriteria: Partial<IPTransaction> = {
      coincap_id: query.coinId,
      type: query.type,
      portfolio_id: +portfolioId
    };
    removeUndefinedProperties(mappedCriteria);
    const transactions = await this.findWhere(mappedCriteria);
    return transactions;
  }

  static async deleteMany(portfolioId: string, criteria: IDeletePTransactionsQuery) {
    const mappedCriteria: Partial<IPTransaction> = {
      coincap_id: criteria.coinId,
      portfolio_id: +portfolioId
    };
    removeUndefinedProperties(mappedCriteria);
    const deletedTransactions = await this.deleteWhere(mappedCriteria);
    return deletedTransactions;
  }

  static async deleteOne(portfolioId: string, id: string) {
    const [deletedTransaction] = await this.deleteWhere({
      id: +id,
      portfolio_id: +portfolioId
    });
    if (deletedTransaction === undefined) {
      throw new ErrorService(ErrorType.NotFound, `Transaction with id ${id} does not exist`);
    }
    return deletedTransaction;
  }

  static async updateById(portfolioId: string, id: string, update: IUpdatePTransactionReqBody) {
    const mappedUpdates: Partial<IPTransaction> = {
      notes: update?.notes,
      price_per: update?.pricePer,
      type: update?.type,
      quantity: update?.quantity,
      date: update?.date,
      currency_code: update?.currencyCode,
      usd_rate: update?.usdRate
    };
    removeUndefinedProperties(mappedUpdates);
    const [updatedTransaction] = await this.updateWhere(mappedUpdates, { id: +id, portfolio_id: +portfolioId });
    if (updatedTransaction === undefined) {
      throw new ErrorService(ErrorType.NotFound, `Transaction with id ${id} does not exist`);
    }
    return updatedTransaction;
  }

  static async groupByCoin(portfolioId: string, coinIds?: string[]) {
    let groupedHoldings;
    if (coinIds === undefined || coinIds === null) {
      groupedHoldings = db
        .select(
          "coincap_id as coin_id",
          db.raw(
            "CASE WHEN (SUM(CASE WHEN type = 'sell' OR type = 'transfer_out' THEN quantity * -1 ELSE quantity END)) < 0 THEN 0 ELSE (SUM(CASE WHEN type = 'sell' OR type = 'transfer_out' THEN quantity * -1 ELSE quantity END)) END as amount"
          ),
          db.raw("SUM(CASE WHEN type = 'buy' THEN quantity * price_per * usd_rate ELSE 0 END) as total_cost"),
          db.raw("SUM(CASE WHEN type = 'sell' THEN quantity * price_per * usd_rate ELSE 0 END) as total_proceeds")
        )
        .from(TABLE_NAMES.PORTFOLIO_TRANSACTIONS)
        .where({
          portfolio_id: +portfolioId
        })
        .groupBy("coincap_id")
        .as("holding");
    } else {
      groupedHoldings = db
        .select(
          "coincap_id as coin_id",
          db.raw(
            "CASE WHEN (SUM(CASE WHEN type = 'sell' OR type = 'transfer_out' THEN quantity * -1 ELSE quantity END)) < 0 THEN 0 ELSE (SUM(CASE WHEN type = 'sell' OR type = 'transfer_out' THEN quantity * -1 ELSE quantity END)) END as amount"
          ),
          db.raw("SUM(CASE WHEN type = 'buy' THEN quantity * price_per * usd_rate ELSE 0 END) as total_cost"),
          db.raw("SUM(CASE WHEN type = 'sell' THEN quantity * price_per * usd_rate ELSE 0 END) as total_proceeds")
        )
        .from(TABLE_NAMES.PORTFOLIO_TRANSACTIONS)
        .where({
          portfolio_id: +portfolioId
        })
        .whereIn("coincap_id", coinIds)
        .groupBy("coincap_id")
        .as("holding");
    }
    const holdings = await db
      .select<IPortfolioHolding[]>(
        "*",
        db.raw("COALESCE((holding.total_cost - holding.total_proceeds) / NULLIF(amount, 0), 0) as avg_cost")
      )
      .from(groupedHoldings);

    return holdings;
  }

  static async addToPortfolio(portfolioId: string, transaction: IAddPTransactionReqBody) {
    const [createdTransaction] = await this.create({
      notes: transaction.notes,
      type: transaction.type as IPTransactionType,
      quantity: transaction.quantity,
      price_per: transaction.pricePer,
      coincap_id: transaction.coinId,
      portfolio_id: +portfolioId,
      date: transaction.date,
      currency_code: transaction.currencyCode,
      usd_rate: transaction.usdRate
    });
    if (createdTransaction === undefined) {
      throw new ErrorService(ErrorType.BadRequest, "Failed to add transaction to portfolio");
    }
    return createdTransaction;
  }
}
