import axios from "../config/axios";
import config from "../config";
import {
  IGetGainersLosersFilterQuery,
  IGetTopCoinsFilterQuery,
  IMarketsAsset,
  IMarketsAssetDTO,
  IMarketsGainersLosersDTO,
  IMarketsGainersLosersMerged,
  IMarketsGainersLosersRes,
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
    const res = await axios.get<IMarketsTopCoinsRes>(`${config.markets.restURL}/assets`, {
      params: filterQuery
    });
    return res.data;
  }

  public toTopCoinsDTO(topCoinsRes: IMarketsTopCoinsRes): IMarketsTopCoinsDTO {
    return {
      data: topCoinsRes.data.map((c) => this.toMarketAssetDTO(c))
    };
  }

  public async getGainersLosers(filterQuery: IGetGainersLosersFilterQuery): Promise<IMarketsGainersLosersMerged> {
    const gainersRes = await axios.post<IMarketsGainersLosersRes>(
      `${config.markets.graphqlURL}`,
      {
        variables: {
          direction: "DESC",
          first: filterQuery.limit!,
          sort: "changePercent24Hr"
        },
        query:
          "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
      },
      { headers: config.markets.headers }
    );
    const losersRes = await axios.post<IMarketsGainersLosersRes>(
      `${config.markets.graphqlURL}`,
      {
        variables: {
          direction: "ASC",
          first: filterQuery.limit!,
          sort: "changePercent24Hr"
        },
        query:
          "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
      },
      { headers: config.markets.headers }
    );
    return {
      gainers: gainersRes.data,
      losers: losersRes.data
    };
  }

  public toMarketAssetDTO(marketAsset: IMarketsAsset): IMarketsAssetDTO {
    return {
      changePercent24Hr: marketAsset.changePercent24Hr,
      id: marketAsset.id,
      name: marketAsset.name,
      priceUsd: marketAsset.priceUsd,
      rank: marketAsset.rank,
      symbol: marketAsset.symbol
    };
  }

  public toGainersLosersDTO(gainersLosersRes: IMarketsGainersLosersMerged): IMarketsGainersLosersDTO {
    return {
      gainers: gainersLosersRes.gainers.data.assets.edges.map(({ node }) => this.toMarketAssetDTO(node)),
      losers: gainersLosersRes.losers.data.assets.edges.map(({ node }) => this.toMarketAssetDTO(node))
    };
  }
}
