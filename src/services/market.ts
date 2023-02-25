import axios from "../config/axios";
import config from "../config";
import {
  IGrahpqlReqBody,
  IMarketAsset,
  IMarketAssetDTO,
  IMarketGainersLosersDTO,
  IMarketGainersLosersMerged,
  IMarketsGraphqlRes,
  IMarketSummaryDTO,
  IMarketSummaryRes,
  IGetAssetsRes,
  ISearchAssetsDTO,
  IMarketsDTO,
  IAssetOverview,
  IAssetOverviewDTO,
  ITicker,
  IGetAssetPriceHistoryQuery,
  IGetAssetRes,
  IGetAssetPriceHistoryRes,
  IPriceHistory,
  IPriceHistoryDTO,
  IAssetExchange,
  IGetAssetMarketsRes,
  IAssetExchangesDTO,
  IAssetAbout,
  IAssetAboutDTO,
  IAboutLinksDTO,
  ICoinPaprikaAsset
} from "../interfaces/IMarkets";
import { addSubtractTime, calculatePercentChange, abbreviateNum, formatNum } from "../api/utils";
import {
  IGetAssetExchangesQuery,
  IGetAssetsQuery,
  IGetGainersLosersQuery,
  IGetMarketsQuery
} from "../api/routes/markets/req-schemas";
import ErrorService from "./error";
import { ErrorType } from "../enums/error";
import ERROR_MESSAGES from "../constants/error-messages";
import CoinMapService from "./coin-map";

export default class MarketService {
  constructor() {}

  private static async executeGraphqlQuery<Type>(reqBody: IGrahpqlReqBody): Promise<Type> {
    const res = await axios.post<Type>(config.marketsAPI.coinCapGraphql, reqBody, {
      headers: config.marketsAPI.headers
    });
    return res.data;
  }

  static async getAssets(query: IGetAssetsQuery) {
    try {
      const assetsRes = await axios.get<IGetAssetsRes>(`${config?.marketsAPI?.coinCap}/assets`, {
        params: query
      });
      return assetsRes?.data?.data;
    } catch (err) {
      throw new ErrorService(ErrorType.Failed, ERROR_MESSAGES.GENERIC);
    }
  }

  static async getCoinPaprikaAssets() {
    try {
      const assetsRes = await axios.get<ICoinPaprikaAsset[]>(`${config.marketsAPI.coinPaprika}/coins`);
      return assetsRes.data;
    } catch (err) {
      throw new ErrorService(ErrorType.Failed, ERROR_MESSAGES.GENERIC);
    }
  }

  static toMarketImageURL(symbol: string) {
    return `${config.icons.markets}/${symbol?.toLowerCase()}@2x.png`;
  }

  static toSearchAssetsDTO(assets: IMarketAsset[]): ISearchAssetsDTO {
    return {
      data: assets.map((a) => ({
        id: a.id,
        image: this.toMarketImageURL(a.symbol),
        name: a.name,
        symbol: a.symbol
      }))
    };
  }

  static async getSummary() {
    try {
      const summaryRes = await this.executeGraphqlQuery<IMarketSummaryRes>({
        query:
          '{ marketTotal { marketCapUsd  exchangeVolumeUsd24Hr  assets  exchanges  markets } btc: asset(id: "bitcoin") { marketCapUsd }  eth: asset(id: "ethereum") { marketCapUsd } }'
      });
      return summaryRes;
    } catch (err) {
      throw new ErrorService(ErrorType.Failed, ERROR_MESSAGES.GENERIC);
    }
  }

  static toSummaryDTO(summary: IMarketSummaryRes): IMarketSummaryDTO {
    return {
      totalMarketCap: {
        label: "Market Cap",
        value: summary?.data?.marketTotal?.marketCapUsd
      },
      volume24hr: {
        label: "24hr Vol",
        value: summary?.data?.marketTotal?.exchangeVolumeUsd24Hr
      },
      numExchanges: {
        label: "Exchanges",
        value: formatNum(summary?.data?.marketTotal?.exchanges)
      },
      numAssets: {
        label: "Assets",
        value: formatNum(summary?.data?.marketTotal?.assets)
      },
      btcDom: {
        label: "BTC Dominance",
        value: `${formatNum((+summary.data.btc.marketCapUsd / +summary.data.marketTotal.marketCapUsd) * 100)}%`
      },
      ethDom: {
        label: "ETH Dominance",
        value: `${formatNum((+summary.data.eth.marketCapUsd / +summary.data.marketTotal.marketCapUsd) * 100)}%`
      }
    };
  }

  static toMarketsDTO(assets: IMarketAsset[]): IMarketsDTO {
    return {
      data: assets.map((a) => this.toMarketAssetDTO(a))
    };
  }

  static async getGainersLosers(query: IGetGainersLosersQuery): Promise<IMarketGainersLosersMerged> {
    try {
      const gainersReq = this.executeGraphqlQuery<IMarketsGraphqlRes>({
        variables: {
          direction: "DESC",
          first: query.limit!,
          sort: "changePercent24Hr"
        },
        query:
          "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
      });
      const losersReq = this.executeGraphqlQuery<IMarketsGraphqlRes>({
        variables: {
          direction: "ASC",
          first: query.limit!,
          sort: "changePercent24Hr"
        },
        query:
          "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
      });
      const [gainers, losers] = await Promise.all([gainersReq, losersReq]);
      return {
        gainers,
        losers
      };
    } catch (err) {
      throw new ErrorService(ErrorType.Failed, ERROR_MESSAGES.GENERIC);
    }
  }

  static toMarketAssetDTO(ma: IMarketAsset): IMarketAssetDTO {
    return {
      changePercent24Hr: ma?.changePercent24Hr,
      id: ma?.id,
      name: ma?.name,
      priceUsd: ma?.priceUsd,
      symbol: ma?.symbol,
      image: this.toMarketImageURL(ma?.symbol),
      rank: ma?.rank,
      marketCap: ma?.marketCapUsd
    };
  }

  static mapMarketsGraphqlToMarketsDTO(markets: IMarketsGraphqlRes): IMarketsDTO {
    return {
      data: markets.data.assets.edges.map(({ node }) => this.toMarketAssetDTO(node))
    };
  }

  static toGainersLosersDTO(gainersLosers: IMarketGainersLosersMerged): IMarketGainersLosersDTO {
    return {
      gainers: this.mapMarketsGraphqlToMarketsDTO(gainersLosers.gainers).data,
      losers: this.mapMarketsGraphqlToMarketsDTO(gainersLosers.losers).data
    };
  }

  static async getMarkets(query: IGetMarketsQuery) {
    try {
      const markets = await this.executeGraphqlQuery<IMarketsGraphqlRes>({
        variables: {
          direction: query.sortOrder,
          first: query.perPage! * query.page!,
          sort: query.sortBy
        },
        query:
          "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
      });
      //include only new data
      const startIndex = query.perPage! * (query.page! - 1);
      markets.data.assets.edges = markets?.data?.assets?.edges?.slice(startIndex);
      return markets;
    } catch (err) {
      throw new ErrorService(ErrorType.Failed, ERROR_MESSAGES.GENERIC);
    }
  }

  static async getAssetPriceHistory(assetId: string, query: IGetAssetPriceHistoryQuery) {
    try {
      const {
        data: { data: prices }
      } = await axios.get<IGetAssetPriceHistoryRes>(`${config.marketsAPI.coinCap}/assets/${assetId}/history`, {
        params: query
      });
      return prices;
    } catch (err) {
      throw new ErrorService(ErrorType.Failed, ERROR_MESSAGES.GENERIC);
    }
  }

  static toAssetExchangesDTO(assetExchanges: IAssetExchange[]): IAssetExchangesDTO {
    return {
      data: assetExchanges
        .filter((ae) => ae.volumeUsd24Hr !== null)
        .map((ae) => ({
          name: ae.exchangeId,
          priceUsd: ae.priceUsd,
          vol24h: ae.volumeUsd24Hr,
          pair: `${ae.quoteSymbol}/${ae.baseSymbol}`
        }))
    };
  }

  static async getAssetExchanges(assetId: string, query: IGetAssetExchangesQuery) {
    try {
      const {
        data: { data: exchanges }
      } = await axios.get<IGetAssetMarketsRes>(`${config.marketsAPI.coinCap}/assets/${assetId}/markets`, {
        params: {
          limit: query.perPage,
          offset: query.perPage! * (query.page! - 1)
        }
      });
      return exchanges;
    } catch (err) {
      throw new ErrorService(ErrorType.Failed, ERROR_MESSAGES.GENERIC);
    }
  }

  private static async getAssetPriceHistories(assetId: string) {
    try {
      const todayDate = new Date();
      const date1hBefore = addSubtractTime(todayDate, { hours: -1 });
      const date1dBefore = addSubtractTime(todayDate, { days: -1 });
      const date1mBefore = addSubtractTime(todayDate, { months: -1 });
      const date1yBefore = addSubtractTime(todayDate, { years: -1 });

      const history1hReq = this.getAssetPriceHistory(assetId, {
        interval: "m1",
        start: date1hBefore.getTime(),
        end: todayDate.getTime()
      });
      const history1dReq = this.getAssetPriceHistory(assetId, {
        interval: "m5",
        start: date1dBefore.getTime(),
        end: todayDate.getTime()
      });
      const history1mReq = this.getAssetPriceHistory(assetId, {
        interval: "h2",
        start: date1mBefore.getTime(),
        end: todayDate.getTime()
      });
      const history1yReq = this.getAssetPriceHistory(assetId, {
        interval: "d1",
        start: date1yBefore.getTime(),
        end: todayDate.getTime()
      });
      const historyAllReq = this.getAssetPriceHistory(assetId, { interval: "d1" });
      const [history1h, history1d, history1m, history1y, historyAll] = await Promise.all([
        history1hReq,
        history1dReq,
        history1mReq,
        history1yReq,
        historyAllReq
      ]);
      const priceHistories = [
        {
          label: "1h",
          prices: history1h
        },
        {
          label: "1d",
          prices: history1d
        },
        {
          label: "1m",
          prices: history1m
        },
        {
          label: "1y",
          prices: history1y
        },
        {
          label: "All",
          prices: historyAll
        }
      ];
      return priceHistories;
    } catch (err) {
      throw new ErrorService(ErrorType.NotFound, `Asset with id ${assetId} does not exist`);
    }
  }

  static async getAsset(assetId: string) {
    try {
      const {
        data: { data: asset }
      } = await axios.get<IGetAssetRes>(`${config.marketsAPI.coinCap}/assets/${assetId}`);
      return asset;
    } catch (err) {
      throw new ErrorService(ErrorType.NotFound, `Asset with id ${assetId} does not exist`);
    }
  }

  static async getAssetStats(tickerId: string) {
    try {
      const { data: assetStats } = await axios.get<ITicker>(`${config.marketsAPI.coinPaprika}/tickers/${tickerId}`);
      return assetStats;
    } catch (err) {
      throw new ErrorService(ErrorType.NotFound, `Asset with id ${tickerId} does not exist`);
    }
  }

  static async getAssetOverview(assetId: string): Promise<IAssetOverview> {
    const idMap = await CoinMapService.getCorrespondingIds(assetId);
    if (idMap === undefined) {
      throw new ErrorService(ErrorType.NotFound, `Asset with id ${assetId} does not exist`);
    }
    const assetReq = this.getAsset(assetId);
    const priceHistoriesReq = this.getAssetPriceHistories(assetId);
    const statisticsReq = this.getAssetStats(idMap?.coinpaprika_id!);
    const [statistics, asset, priceHistory] = await Promise.all([statisticsReq, assetReq, priceHistoriesReq]);
    return {
      asset,
      statistics,
      priceHistory
    };
  }

  static toPriceHistoryDTO(priceHistory: IPriceHistory, currentPrice: string): IPriceHistoryDTO {
    const initialPrice = priceHistory?.prices[0]?.priceUsd;

    return {
      label: priceHistory.label,
      history: {
        prices: priceHistory.prices,
        percentChange: initialPrice ? calculatePercentChange(+currentPrice, +initialPrice) : 0
      }
    };
  }

  static toAssetOverviewDTO(ao: IAssetOverview): IAssetOverviewDTO {
    return {
      rank: ao.asset.rank,
      name: ao.asset.name,
      priceUsd: ao.asset.priceUsd,
      priceHistory: ao.priceHistory.map((ph) => this.toPriceHistoryDTO(ph, ao.asset.priceUsd)),
      statistics: [
        {
          data: [
            { label: "Market Cap", value: ao.asset.marketCapUsd },
            { label: "Volume 24h", value: ao.asset.volumeUsd24Hr },
            {
              label: "Max Supply",
              value: ao.statistics.max_supply !== undefined ? abbreviateNum(ao.statistics.max_supply) : "--"
            }
          ]
        },
        {
          data: [
            {
              label: "Total Supply",
              value: ao.statistics.total_supply !== undefined ? abbreviateNum(ao.statistics.total_supply) : "--"
            },
            {
              label: "All Time High",
              value: ao.statistics.quotes?.USD.ath_price !== undefined ? `${ao.statistics.quotes.USD.ath_price}` : "--"
            }
          ]
        }
      ]
    };
  }

  static toAssetAboutDTO(assetAbout: IAssetAbout): IAssetAboutDTO {
    const links: IAboutLinksDTO = {};

    for (let l of assetAbout.links_extended || []) {
      if (!links[l.type]) {
        links[l.type] = { urls: [l.url], stats: l.stats };
      } else {
        links[l.type].urls.push(l.url);
        if (!links[l.type].stats) {
          links[l.type].stats = l.stats;
        }
      }
    }

    return {
      description: assetAbout.description || "",
      links
    };
  }

  static async getAssetAbout(assetId: string) {
    try {
      const idMap = await CoinMapService.getCorrespondingIds(assetId);
      if (idMap === undefined) {
        throw new ErrorService(ErrorType.NotFound, `Asset with id ${assetId} does not exist`);
      }
      const { data } = await axios.get<IAssetAbout>(`${config.marketsAPI.coinPaprika}/coins/${idMap.coinpaprika_id!}`);
      return data;
    } catch (err) {
      throw new ErrorService(ErrorType.NotFound, `Asset with id ${assetId} does not exist`);
    }
  }
}
