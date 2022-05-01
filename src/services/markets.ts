import axios from "../config/axios";
import config from "../config";
import { IMarketsSummaryDTO, IMarketsSummaryRes } from "../interfaces/IMarkets";

export default class MarketsService {
  constructor() {}

  public async getSummary(): Promise<IMarketsSummaryRes> {
    const res = await axios.post<IMarketsSummaryRes>(
      config.market.graphqlURL,
      {
        query:
          '{  marketTotal {    marketCapUsd    exchangeVolumeUsd24Hr    assets    exchanges    markets  }  btc: asset(id: "bitcoin") {    marketCapUsd}  eth: asset(id: "ethereum") {    marketCapUsd}}'
      },
      { headers: config.market.headers }
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
}
