import axios from "../config/axios";
import config from "../config";
import {
  IGetTopCoinsFilterQuery,
  IMarketsSummaryDTO,
  IMarketsSummaryRes,
  IMarketsTopCoinsDTO,
  IMarketsTopCoinsRes
} from "../interfaces/IMarkets";

export default class MarketsService {
  constructor() {}

  public async getSummary(): Promise<IMarketsSummaryRes> {
    const res = await axios.post<IMarketsSummaryRes>(
      config.markets.graphqlURL,
      {
        query:
          '{  marketTotal {    marketCapUsd    exchangeVolumeUsd24Hr    assets    exchanges    markets  }  btc: asset(id: "bitcoin") {    marketCapUsd}  eth: asset(id: "ethereum") {    marketCapUsd}}'
      },
      { headers: config.markets.headers }
    );
    return res.data;
  }

  public toSummaryDTO(summaryRes: IMarketsSummaryRes): IMarketsSummaryDTO {
    return {
      totalMarketCap: summaryRes.data.marketTotal.marketCapUsd,
      volume24hr: summaryRes.data.marketTotal.exchangeVolumeUsd24Hr,
      numExchanges: summaryRes.data.marketTotal.exchanges,
      numAssets: summaryRes.data.marketTotal.assets,
      btcDom: `${(Number(summaryRes.data.btc.marketCapUsd) / Number(summaryRes.data.marketTotal.marketCapUsd)) * 100}`,
      ethDom: `${(Number(summaryRes.data.eth.marketCapUsd) / Number(summaryRes.data.marketTotal.marketCapUsd)) * 100}`
    };
  }

  public async getTopCoins(filterQuery: IGetTopCoinsFilterQuery): Promise<IMarketsTopCoinsRes> {
    const res = await axios.get(`${config.markets.restURL}/assets`, {
      params: filterQuery
    });
    return res.data;
  }

  public toTopCoinsDTO(topCoinsRes: IMarketsTopCoinsRes): IMarketsTopCoinsDTO {
    return {
      data: topCoinsRes.data.map((c) => ({
        changePercent24Hr: c.changePercent24Hr,
        id: c.id,
        name: c.name,
        priceUsd: c.priceUsd,
        rank: c.rank,
        symbol: c.symbol
      }))
    };
  }
}
