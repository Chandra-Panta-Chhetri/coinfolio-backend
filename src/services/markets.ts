import axios from "../config/axios";
import config from "../config";
import {
  IGetGainersLosersFilterQuery,
  IGrahpqlQueryBody,
  IMarketsAsset,
  IMarketsAssetDTO,
  IMarketsGainersLosersDTO,
  IMarketsGainersLosersMerged,
  IMarketsGainersLosersRes,
  IMarketsSummaryDTO,
  IMarketsSummaryRes,
  IAssetsDTO,
  IAssetsRes,
  IAssetsFilterQuery,
  ISearchAssetsDTO
} from "../interfaces/IMarkets";
import { toDollarString, toMarketImageURL, toNDecimals, toPercentString } from "../api/utils";

export default class MarketsService {
  constructor() {}

  private async executeGraphqlQuery<Type>(queryBody: IGrahpqlQueryBody): Promise<Type> {
    const res = await axios.post<Type>(config.markets.graphqlURL, queryBody, { headers: config.markets.headers });
    return res.data;
  }

  public async getAssets(filterQuery: IAssetsFilterQuery): Promise<IAssetsRes> {
    const assetsRes = await axios.get<IAssetsRes>(`${config.markets.restURL}/assets`, {
      params: filterQuery
    });
    return assetsRes.data;
  }

  public toSearchAssetsDTO(assetsRes: IAssetsRes): ISearchAssetsDTO {
    return {
      data: assetsRes.data.map((a) => ({
        id: a.id,
        image: toMarketImageURL(a.symbol),
        name: a.name,
        symbol: a.symbol
      }))
    };
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

  public toAssetsDTO(assetsRes: IAssetsRes): IAssetsDTO {
    return {
      data: assetsRes.data.map((a) => this.toMarketAssetDTO(a))
    };
  }

  public async getGainersLosers(filterQuery: IGetGainersLosersFilterQuery): Promise<IMarketsGainersLosersMerged> {
    const gainersReq = this.executeGraphqlQuery<IMarketsGainersLosersRes>({
      variables: {
        direction: "DESC",
        first: filterQuery.limit!,
        sort: "changePercent24Hr"
      },
      query:
        "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
    });
    const losersReq = await this.executeGraphqlQuery<IMarketsGainersLosersRes>({
      variables: {
        direction: "ASC",
        first: filterQuery.limit!,
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

  public toMarketAssetDTO(ma: IMarketsAsset): IMarketsAssetDTO {
    return {
      changePercent24Hr: toNDecimals(ma.changePercent24Hr),
      id: ma.id,
      name: ma.name,
      priceUsd: toNDecimals(ma.priceUsd),
      symbol: ma.symbol,
      image: toMarketImageURL(ma.symbol)
    };
  }

  public toGainersLosersDTO(gainersLosersRes: IMarketsGainersLosersMerged): IMarketsGainersLosersDTO {
    return {
      gainers: gainersLosersRes.gainers.data.assets.edges.map(({ node }) => this.toMarketAssetDTO(node)),
      losers: gainersLosersRes.losers.data.assets.edges.map(({ node }) => this.toMarketAssetDTO(node))
    };
  }
}
