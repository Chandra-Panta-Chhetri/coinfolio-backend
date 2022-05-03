import axios from "../config/axios";
import config from "../config";
import {
  IGetGainersLosersFilterQuery,
  IGetTopCoinsFilterQuery,
  IGrahpqlQueryBody,
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

  private async executeGraphqlQuery<Type>(queryBody: IGrahpqlQueryBody): Promise<Type> {
    const res = await axios.post<Type>(config.markets.graphqlURL, queryBody, { headers: config.markets.headers });
    return res.data;
  }

  public async getSummary(): Promise<IMarketsSummaryRes> {
    const summaryRes = await this.executeGraphqlQuery<IMarketsSummaryRes>({
      query:
        '{ marketTotal { marketCapUsd  exchangeVolumeUsd24Hr  assets  exchanges  markets } btc: asset(id: "bitcoin") { marketCapUsd }  eth: asset(id: "ethereum") { marketCapUsd } }'
    });
    return summaryRes;
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
    const gainersRes = await this.executeGraphqlQuery<IMarketsGainersLosersRes>({
      variables: {
        direction: "DESC",
        first: filterQuery.limit!,
        sort: "changePercent24Hr"
      },
      query:
        "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
    });
    const losersRes = await this.executeGraphqlQuery<IMarketsGainersLosersRes>({
      variables: {
        direction: "ASC",
        first: filterQuery.limit!,
        sort: "changePercent24Hr"
      },
      query:
        "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
    });
    return {
      gainers: gainersRes,
      losers: losersRes
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
