import TABLE_NAMES from "../constants/db-table-names";
import { IMarketAssetIdMap } from "../interfaces/IMarkets";
import db from "../loaders/db";

export default class CoinMapService {
  constructor() {}

  private static async findWhere(criteria: Partial<IMarketAssetIdMap>) {
    try {
      const idMaps = await db
        .select<IMarketAssetIdMap[]>("*")
        .from(TABLE_NAMES.COINCAP_MAP)
        .where(criteria)
        .whereNotNull("coinpaprika_id");
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
