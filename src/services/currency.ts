import { IGetCurrenciesQuery } from "../api/routes/currencies/req-schemas";
import TABLE_NAMES from "../constants/db-table-names";
import ERROR_MESSAGES from "../constants/error-messages";
import { ErrorType } from "../enums/error";
import { ICurrency } from "../interfaces/ICurrency";
import db from "../loaders/db";
import Logger from "../loaders/logger";
import ErrorService from "./error";

export default class CurrencyService {
  constructor() {}

  static async getCurrencies(query: IGetCurrenciesQuery) {
    try {
      const skip = (query.page! - 1) * query.perPage!;
      const currencies = await db
        .select<ICurrency[]>("*")
        .from(TABLE_NAMES.CURRENCY)
        .offset(skip)
        .limit(query?.perPage!);
      return currencies;
    } catch (err) {
      Logger.error("GET CURRENCIES FAILED " + (err as Error)?.message);
      throw new ErrorService(ErrorType.Failed, ERROR_MESSAGES.GENERIC);
    }
  }
}
