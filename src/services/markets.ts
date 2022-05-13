import axios from "../config/axios";
import config from "../config";
import {
  IGetGainersLosersQueryParams,
  IGrahpqlReqBody,
  IMarketAsset,
  IMarketAssetDTO,
  IMarketGainersLosersDTO,
  IMarketGainersLosersMerged,
  IMarketsGraphqlRes,
  IMarketSummaryDTO,
  IMarketSummaryRes,
  IMarketAssetsDTO,
  IGetAssetsRes,
  IAssetsQueryParams,
  ISearchAssetsDTO,
  IGetMarketsQueryParams,
  IMarketsDTO
} from "../interfaces/IMarkets";
import { toDollarString, toMarketImageURL, toNDecimals, toPercentString } from "../api/utils";

export default class MarketsService {
  constructor() {}

  private async executeGraphqlQuery<Type>(reqBody: IGrahpqlReqBody): Promise<Type> {
    const res = await axios.post<Type>(config.markets.graphqlURL, reqBody, { headers: config.markets.headers });
    return res.data;
  }

  public async getAssets(queryParams: IAssetsQueryParams): Promise<IGetAssetsRes> {
    const assetsRes = await axios.get<IGetAssetsRes>(`${config.markets.restURL}/assets`, {
      params: queryParams
    });
    return assetsRes.data;
  }

  public toSearchAssetsDTO(assetsRes: IGetAssetsRes): ISearchAssetsDTO {
    return {
      data: assetsRes.data.map((a) => ({
        id: a.id,
        image: toMarketImageURL(a.symbol),
        name: a.name,
        symbol: a.symbol
      }))
    };
  }

  public async getSummary(): Promise<IMarketSummaryRes> {
    const summaryRes = await this.executeGraphqlQuery<IMarketSummaryRes>({
      query:
        '{ marketTotal { marketCapUsd  exchangeVolumeUsd24Hr  assets  exchanges  markets } btc: asset(id: "bitcoin") { marketCapUsd }  eth: asset(id: "ethereum") { marketCapUsd } }'
    });
    return summaryRes;
  }

  public toSummaryDTO(summaryRes: IMarketSummaryRes): IMarketSummaryDTO {
    return {
      totalMarketCap: {
        label: "Market Cap",
        value: toDollarString(summaryRes.data.marketTotal.marketCapUsd)
      },
      volume24hr: {
        label: "24hr Vol",
        value: toDollarString(summaryRes.data.marketTotal.exchangeVolumeUsd24Hr)
      },
      numExchanges: {
        label: "Exchanges",
        value: summaryRes.data.marketTotal.exchanges
      },
      numAssets: {
        label: "Assets",
        value: summaryRes.data.marketTotal.assets
      },
      btcDom: {
        label: "BTC Dominance",
        value: toPercentString(
          (Number(summaryRes.data.btc.marketCapUsd) / Number(summaryRes.data.marketTotal.marketCapUsd)) * 100
        )
      },
      ethDom: {
        label: "ETH Dominance",
        value: toPercentString(
          (Number(summaryRes.data.eth.marketCapUsd) / Number(summaryRes.data.marketTotal.marketCapUsd)) * 100
        )
      }
    };
  }

  public toAssetsDTO(assetsRes: IGetAssetsRes): IMarketAssetsDTO {
    return {
      data: assetsRes.data.map((a) => this.toMarketAssetDTO(a))
    };
  }

  public async getGainersLosers(queryParams: IGetGainersLosersQueryParams): Promise<IMarketGainersLosersMerged> {
    const gainersReq = this.executeGraphqlQuery<IMarketsGraphqlRes>({
      variables: {
        direction: "DESC",
        first: queryParams.limit!,
        sort: "changePercent24Hr"
      },
      query:
        "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
    });
    const losersReq = await this.executeGraphqlQuery<IMarketsGraphqlRes>({
      variables: {
        direction: "ASC",
        first: queryParams.limit!,
        sort: "changePercent24Hr"
      },
      query:
        "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
    });
    const requests = [gainersReq, losersReq];
    const res = await Promise.all(requests);
    return {
      gainers: res[0],
      losers: res[1]
    };
  }

  public toMarketAssetDTO(ma: IMarketAsset): IMarketAssetDTO {
    return {
      changePercent24Hr: toNDecimals(ma.changePercent24Hr),
      id: ma.id,
      name: ma.name,
      priceUsd: toNDecimals(ma.priceUsd),
      symbol: ma.symbol,
      image: toMarketImageURL(ma.symbol),
      rank: ma.rank,
      marketCap: toDollarString(ma.marketCapUsd)
    };
  }

  public toMarketsDTO(marketsRes: IMarketsGraphqlRes): IMarketsDTO {
    return {
      data: marketsRes.data.assets.edges.map(({ node }) => this.toMarketAssetDTO(node))
    };
  }

  public toGainersLosersDTO(gainersLosersRes: IMarketGainersLosersMerged): IMarketGainersLosersDTO {
    return {
      gainers: this.toMarketsDTO(gainersLosersRes.gainers).data,
      losers: this.toMarketsDTO(gainersLosersRes.losers).data
    };
  }

  public async getMarkets(queryParams: IGetMarketsQueryParams): Promise<IMarketsGraphqlRes> {
    const marketsRes = await this.executeGraphqlQuery<IMarketsGraphqlRes>({
      variables: {
        direction: queryParams.sortOrder,
        first: queryParams.perPage! * queryParams.page!,
        sort: queryParams.sortBy
      },
      query:
        "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
    });
    //include only new data
    const startIndex = queryParams.perPage! * (queryParams.page! - 1);
    marketsRes.data.assets.edges = marketsRes.data.assets.edges.slice(startIndex);
    return marketsRes;
  }
}
