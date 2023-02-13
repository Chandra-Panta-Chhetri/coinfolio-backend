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

  static async getCorrespondingIds(coinId: string) {
    const [idMap] = await db.select<IMarketAssetIdMap[]>("*").from(TABLE_NAMES.COINCAP_MAP).where({
      coincap_id: coinId
    });
    if (idMap === undefined) {
      throw new ErrorService(ErrorType.BadRequest, `${coinId} does not have any mappings`);
    }
    return idMap;
  }
}
