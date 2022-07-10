interface IMarketTotal {
  marketCapUsd: string;
  exchangeVolumeUsd24Hr: string;
  exchanges: string;
  markets: string;
  assets: string;
}

interface IAssetSummary {
  marketCapUsd: string;
}

export interface IMarketSummaryRes {
  data: {
    marketTotal: IMarketTotal;
    btc: IAssetSummary;
    eth: IAssetSummary;
  };
}

interface ILabelValue {
  label: string;
  value: string;
}

export interface IMarketSummaryDTO {
  totalMarketCap: ILabelValue;
  volume24hr: ILabelValue;
  numExchanges: ILabelValue;
  numAssets: ILabelValue;
  btcDom: ILabelValue;
  ethDom: ILabelValue;
}

export interface IMarketAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

export interface IGrahpqlReqBody {
  variables?: Object;
  query: string;
}

export interface IMarketAssetDTO {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  changePercent24Hr: number;
  image: string;
  rank: string;
  marketCap: string;
}

export interface IGetAssetsRes {
  data: IMarketAsset[];
}

export interface ISearchAssetDTO {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

export interface ISearchAssetsDTO {
  data: ISearchAssetDTO[];
}

export interface IGetAssetsQuery {
  search?: string;
  limit?: number;
}

export interface IGetGainersLosersQuery {
  limit?: number;
}

export interface IMarketsGraphqlRes {
  data: {
    assets: {
      edges: { node: IMarketAsset }[];
    };
  };
}

export interface IMarketGainersLosersMerged {
  gainers: IMarketsGraphqlRes;
  losers: IMarketsGraphqlRes;
}

export interface IMarketGainersLosersDTO {
  gainers: IMarketAssetDTO[];
  losers: IMarketAssetDTO[];
}

export interface IMarketsDTO {
  data: IMarketAssetDTO[];
}

export interface IGetMarketsQuery {
  sortBy?: string;
  sortOrder?: string;
  perPage?: number;
  page?: number;
}

export interface IGetAssetOverviewParams {
  id?: string;
}

export interface IPrice {
  priceUsd: string;
  time: number;
}

export interface IPriceHistory {
  label: string;
  prices: IPrice[];
}

export interface IPriceHistoryDTO {
  label: string;
  history: IPricePercentChangeDTO;
}

export interface IAssetOverview {
  statistics: ITicker;
  priceHistory: IPriceHistory[];
  asset: IMarketAsset;
}

export interface IAssetOverviewDTO {
  statistics: IStatisticsSection[];
  priceHistory: IPriceHistoryDTO[];
  name: string;
  rank: string;
  priceUsd: number;
}

interface IStatisticsSection {
  data: ILabelValue[];
}

interface ITickerQuote {
  [key: string]: {
    ath_price: number;
  };
}

export interface ITicker {
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  quotes: ITickerQuote;
}

export interface IGetAssetPriceHistoryQuery {
  interval: "m1" | "m5" | "m15" | "m30" | "h1" | "h2" | "h6" | "h12" | "d1";
  start?: number;
  end?: number;
}

export interface IPricePercentChangeDTO {
  prices: IPrice[];
  percentChange: number;
}

export interface IGetAssetPriceHistoryRes {
  data: IPrice[];
}

export interface IGetAssetRes {
  data: IMarketAsset;
}

export interface IGetAssetExchangesParams {
  id?: string;
}

export interface IGetAssetExchangesQuery {
  perPage?: number;
  page?: number;
}

export interface IAssetExchange {
  exchangeId: string;
  baseId: string;
  quoteId: string;
  baseSymbol: string;
  quoteSymbol: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  volumePercent: string;
}

interface IAssetExchangeDTO {
  name: string;
  priceUsd: string;
  vol24h: string;
  pair: string;
}

export interface IAssetExchangesDTO {
  data: IAssetExchangeDTO[];
}

export interface IGetAssetMarketsRes {
  data: IAssetExchange[];
}

export interface IGetAssetAboutParams {
  id?: string;
}

export interface IGetAssetAboutQuery {
  symbol?: string;
  name?: string;
}

interface IAssetAboutTag {
  id: string;
  name: string;
  coin_counter: number;
  ico_counter: number;
}

interface IAssetAboutWhitepaper {
  link: string;
  thumbnail: string;
}

interface IAssetAboutLinks {
  [key: string]: string[];
}

interface IAssetAboutExtendedLink {
  url: string;
  type: string;
  stats?: { [key: string]: number };
}

export interface IAssetAbout {
  description: string;
  proof_type: string;
  hash_algorithm: string;
  links: IAssetAboutLinks;
  links_extended: IAssetAboutExtendedLink[];
  whitepaper: IAssetAboutWhitepaper;
  tags: IAssetAboutTag[];
}

interface IAssetAboutLinkDTO {
  url: string;
  stats?: { [key: string]: number };
}

export interface IAssetAboutLinksDTO {
  [key: string]: IAssetAboutLinkDTO[];
}

export interface IAssetAboutDTO {
  description: string;
  links: IAssetAboutLinksDTO;
}
