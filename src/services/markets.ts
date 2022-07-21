import axios from "../config/axios";
import config from "../config";
import postgres from "../loaders/postgres";
import {
  IGetGainersLosersQuery,
  IGrahpqlReqBody,
  IMarketAsset,
  IMarketAssetDTO,
  IMarketGainersLosersDTO,
  IMarketGainersLosersMerged,
  IMarketsGraphqlRes,
  IMarketSummaryDTO,
  IMarketSummaryRes,
  IGetAssetsRes,
  IGetAssetsQuery,
  ISearchAssetsDTO,
  IGetMarketsQuery,
  IMarketsDTO,
  IGetAssetOverviewParams,
  IAssetOverview,
  IAssetOverviewDTO,
  ITicker,
  IPrice,
  IGetAssetPriceHistoryQuery,
  IGetAssetRes,
  IGetAssetPriceHistoryRes,
  IPriceHistory,
  IPriceHistoryDTO,
  IGetAssetExchangesParams,
  IGetAssetExchangesQuery,
  IAssetExchange,
  IGetAssetMarketsRes,
  IAssetExchangesDTO,
  IGetAssetAboutParams,
  IAssetAbout,
  IAssetAboutDTO,
  IAboutLinksDTO,
  ICoinPaprikaAsset,
  IMarketAssetIdMap
} from "../interfaces/IMarkets";
import {
  addSubtractTime,
  calculatePercentChange,
  toDollarString,
  toMarketImageURL,
  toNDecimals,
  toPercentString
} from "../api/utils";
import Logger from "../loaders/logger";

export default class MarketsService {
  constructor() {}

  private async executeGraphqlQuery<Type>(reqBody: IGrahpqlReqBody): Promise<Type> {
    const res = await axios.post<Type>(config.marketsAPI.coinCapGraphql, reqBody, {
      headers: config.marketsAPI.headers
    });
    return res.data;
  }

  public async getAssets(query: IGetAssetsQuery): Promise<IMarketAsset[]> {
    const assetsRes = await axios.get<IGetAssetsRes>(`${config.marketsAPI.coinCap}/assets`, {
      params: query
    });
    return assetsRes.data.data;
  }

  public async getCoinPaprikaAssets(): Promise<ICoinPaprikaAsset[]> {
    const assetsRes = await axios.get<ICoinPaprikaAsset[]>(`${config.marketsAPI.coinPaprika}/coins`);
    return assetsRes.data;
  }

  public mapMarketAssetsToSearchAssetsDTO(assets: IMarketAsset[]): ISearchAssetsDTO {
    return {
      data: assets.map((a) => ({
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

  public mapMarketAssetsToMarketsDTO(assets: IMarketAsset[]): IMarketsDTO {
    return {
      data: assets.map((a) => this.toMarketAssetDTO(a))
    };
  }

  public async getGainersLosers(query: IGetGainersLosersQuery): Promise<IMarketGainersLosersMerged> {
    const gainersReq = this.executeGraphqlQuery<IMarketsGraphqlRes>({
      variables: {
        direction: "DESC",
        first: query.limit!,
        sort: "changePercent24Hr"
      },
      query:
        "query ( $after: String $before: String $direction: SortDirection $first: Int $last: Int $sort: AssetSortInput ) { assets( after: $after before: $before direction: $direction first: $first last: $last sort: $sort ) { edges { node { changePercent24Hr name id logo marketCapUsd priceUsd rank supply symbol volumeUsd24Hr vwapUsd24Hr } } } }"
    });
    const losersReq = await this.executeGraphqlQuery<IMarketsGraphqlRes>({
      variables: {
        direction: "ASC",
        first: query.limit!,
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

  public mapMarketsGraphqlToMarketsDTO(marketsRes: IMarketsGraphqlRes): IMarketsDTO {
    return {
      data: marketsRes.data.assets.edges.map(({ node }) => this.toMarketAssetDTO(node))
    };
  }

  public toGainersLosersDTO(gainersLosersRes: IMarketGainersLosersMerged): IMarketGainersLosersDTO {
    return {
      gainers: this.mapMarketsGraphqlToMarketsDTO(gainersLosersRes.gainers).data,
      losers: this.mapMarketsGraphqlToMarketsDTO(gainersLosersRes.losers).data
    };
  }

  public async getMarkets(query: IGetMarketsQuery): Promise<IMarketsGraphqlRes> {
    const marketsRes = await this.executeGraphqlQuery<IMarketsGraphqlRes>({
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
    marketsRes.data.assets.edges = marketsRes.data.assets.edges.slice(startIndex);
    return marketsRes;
  }

  public async getAssetPriceHistory(id: string, query: IGetAssetPriceHistoryQuery): Promise<IPrice[]> {
    const {
      data: { data: prices }
    } = await axios.get<IGetAssetPriceHistoryRes>(`${config.marketsAPI.coinCap}/assets/${id}/history`, {
      params: query
    });
    return prices;
  }

  public toAssetExchangesDTO(assetExchanges: IAssetExchange[]): IAssetExchangesDTO {
    return {
      data: assetExchanges.map((ae) => ({
        name: ae.exchangeId,
        priceUsd: ae.priceUsd,
        vol24h: ae.volumeUsd24Hr,
        pair: `${ae.quoteSymbol}/${ae.baseSymbol}`
      }))
    };
  }

  public async getAssetExchanges(
    params: IGetAssetExchangesParams,
    query: IGetAssetExchangesQuery
  ): Promise<IAssetExchange[]> {
    const {
      data: { data: exchanges }
    } = await axios.get<IGetAssetMarketsRes>(`${config.marketsAPI.coinCap}/assets/${params.id!}/markets`, {
      params: {
        limit: query.perPage,
        offset: query.perPage! * (query.page! - 1)
      }
    });
    return exchanges;
  }

  public async getCorrespondingIdsByCoincapId(coincapId: string): Promise<IMarketAssetIdMap> {
    const idMaps = await postgres<
      IMarketAssetIdMap[]
    >`SELECT * FROM coincap_coinpaprika_id WHERE coincap_id = ${coincapId}`;
    return idMaps.length !== 0 ? idMaps[0] : { coincap_id: null, coinpaprika_id: null };
  }

  public async getAssetOverview(params: IGetAssetOverviewParams): Promise<IAssetOverview> {
    const todayDate = new Date();

    const {
      data: { data: asset }
    } = await axios.get<IGetAssetRes>(`${config.marketsAPI.coinCap}/assets/${params.id!}`);
    const date1hBefore = addSubtractTime(todayDate, { hours: -1 });
    const date1dBefore = addSubtractTime(todayDate, { days: -1 });
    const date1mBefore = addSubtractTime(todayDate, { months: -1 });
    const date1yBefore = addSubtractTime(todayDate, { years: -1 });

    const history1hReq = this.getAssetPriceHistory(params.id!, {
      interval: "m1",
      start: date1hBefore.getTime(),
      end: todayDate.getTime()
    });
    const history1dReq = this.getAssetPriceHistory(params.id!, {
      interval: "m5",
      start: date1dBefore.getTime(),
      end: todayDate.getTime()
    });
    const history1mReq = this.getAssetPriceHistory(params.id!, {
      interval: "h2",
      start: date1mBefore.getTime(),
      end: todayDate.getTime()
    });
    const history1yReq = this.getAssetPriceHistory(params.id!, {
      interval: "d1",
      start: date1yBefore.getTime(),
      end: todayDate.getTime()
    });
    const historyAllReq = this.getAssetPriceHistory(params.id!, { interval: "d1" });

    const ids = await this.getCorrespondingIdsByCoincapId(asset.id);
    const statisticsReq = ids?.coinpaprika_id
      ? axios.get<ITicker>(`${config.marketsAPI.coinPaprika}/tickers/${ids?.coinpaprika_id}`)
      : Promise.resolve({ data: {} });

    const [{ data: statistics }, history1h, history1d, history1m, history1y, historyAll] = await Promise.all([
      statisticsReq,
      history1hReq,
      history1dReq,
      history1mReq,
      history1yReq,
      historyAllReq
    ]);

    const priceHistory = [
      ...(history1h.length > 0
        ? [
            {
              label: "1h",
              prices: history1h
            }
          ]
        : []),
      ...(history1d.length > 0
        ? [
            {
              label: "1d",
              prices: history1d
            }
          ]
        : []),
      ...(history1m.length > 0
        ? [
            {
              label: "1m",
              prices: history1m
            }
          ]
        : []),
      ...(history1y.length > 0
        ? [
            {
              label: "1y",
              prices: history1y
            }
          ]
        : []),
      ...(historyAll.length > 0
        ? [
            {
              label: "All",
              prices: historyAll
            }
          ]
        : [])
    ];

    return {
      asset,
      statistics,
      priceHistory
    };
  }

  public toPriceHistoryDTO(priceHistory: IPriceHistory, currentPrice: string): IPriceHistoryDTO {
    const initialPrice = priceHistory.prices[0]?.priceUsd;

    return {
      label: priceHistory.label,
      history: {
        prices: priceHistory.prices,
        percentChange: initialPrice ? calculatePercentChange(Number(currentPrice), Number(initialPrice)) : 0
      }
    };
  }

  public toAssetOverviewDTO(ao: IAssetOverview): IAssetOverviewDTO {
    return {
      rank: ao.asset.rank,
      name: ao.asset.name,
      priceUsd: toNDecimals(ao.asset.priceUsd),
      priceHistory: ao.priceHistory.map((ph) => this.toPriceHistoryDTO(ph, ao.asset.priceUsd)),
      statistics: [
        {
          data: [
            { label: "Market Cap", value: toDollarString(ao.asset.marketCapUsd) },
            { label: "Volume 24h", value: toDollarString(ao.asset.volumeUsd24Hr) },
            { label: "Max Supply", value: `${ao.statistics.max_supply || "N/A"}` }
          ]
        },
        {
          data: [
            { label: "Total Supply", value: `${ao.statistics.total_supply || "N/A"}` },
            { label: "All Time High", value: `$${ao.statistics.quotes?.USD.ath_price || "N/A"}` }
          ]
        }
      ]
    };
  }

  public toAssetAboutDTO(assetAbout: IAssetAbout): IAssetAboutDTO {
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

  public async getAssetAbout(params: IGetAssetAboutParams): Promise<IAssetAbout> {
    const ids = await this.getCorrespondingIdsByCoincapId(params.id!);
    if (ids?.coinpaprika_id) {
      const { data } = await axios.get<IAssetAbout>(`${config.marketsAPI.coinPaprika}/coins/${ids.coinpaprika_id}`);
      return data;
    }
    return {};
  }
}
