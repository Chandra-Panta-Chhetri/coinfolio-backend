import axios from "../config/axios";
import config from "../config";
import { IGetNewsDTO, IGetNews } from "../interfaces/INews";
import { IGetNewsQuery } from "../api/routes/news/req-schemas";
import ErrorService from "./error";
import { ErrorType } from "../enums/error";
import ERROR_MESSAGES from "../constants/error-messages";
import db from "../loaders/db";
import { IMarketAssetIdMap } from "../interfaces/IMarkets";
import TABLE_NAMES from "../constants/db-table-names";

export default class CoinMapService {
  constructor() {}

  private static async findWhere(criteria: Partial<IMarketAssetIdMap>) {
    try {
      const idMaps = await db.select<IMarketAssetIdMap[]>("*").from(TABLE_NAMES.COINCAP_MAP).where(criteria);
      return idMaps;
    } catch (err) {
      return [];
    }
  }

  static async getCorrespondingIds(coinId: string) {
    const [idMap] = await this.findWhere({
      coincap_id: coinId
    });
    return idMap;
  }
}
