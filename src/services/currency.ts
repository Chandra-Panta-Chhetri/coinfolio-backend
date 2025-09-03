import { IGetCurrenciesQuery } from "../api/routes/currencies/req-schemas";
import TABLE_NAMES from "../constants/db-table-names";
import ERROR_MESSAGES from "../constants/error-messages";
import { ErrorType } from "../enums/error";
import { ICurrency, ICurrencyDTO, IGetCurrencyRateRes } from "../interfaces/ICurrency";
import db from "../loaders/db";
import Logger from "../loaders/logger";
import ErrorService from "./error";
import axios from "../config/axios";
import config from "../config";

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

  private static async findWhere(criteria: Partial<ICurrency>) {
    try {
      const currencies = await db.select<ICurrency[]>("*").from(TABLE_NAMES.CURRENCY).where(criteria);
      return currencies;
    } catch (err) {
      return [];
    }
  }

  static async getCurrency(currencyCode: string) {
    const [currency] = await this.findWhere({
      code: currencyCode?.toUpperCase()
    });
    if (currency === undefined) {
      throw new ErrorService(ErrorType.NotFound, `Currency with code ${currencyCode} does not exist`);
    }
    const coincapId = currency.coincap_id;
    const getCurrencyRateRes = await axios.get<IGetCurrencyRateRes>(`${config.currencyAPI.coinCap}/rates/${coincapId}`);
    if (getCurrencyRateRes?.data?.data === undefined) {
      throw new ErrorService(ErrorType.NotFound, `Failed to get currency rate`);
    }
    const currencyRate = getCurrencyRateRes?.data?.data?.rateUsd;
    const currencyDTO: ICurrencyDTO = {
      ...currency,
      rate_usd: currencyRate
    };
    return currencyDTO;
  }
}
