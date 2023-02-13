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
  priceUsd: string;
  changePercent24Hr: string | null;
  image: string;
  rank: string;
  marketCap: string | null;
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
  priceUsd: string;
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
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  quotes?: ITickerQuote;
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
  vol24h: string | null;
  pair: string;
}

export interface IAssetExchangesDTO {
  data: IAssetExchangeDTO[];
}

export interface IGetAssetMarketsRes {
  data: IAssetExchange[];
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
  description?: string;
  proof_type?: string;
  hash_algorithm?: string;
  links?: IAssetAboutLinks;
  links_extended?: IAssetAboutExtendedLink[];
  whitepaper?: IAssetAboutWhitepaper;
  tags?: IAssetAboutTag[];
}

interface IAboutLinkDTO {
  urls: string[];
  stats?: { [key: string]: number };
}

export interface IAboutLinksDTO {
  [key: string]: IAboutLinkDTO;
}

export interface IAssetAboutDTO {
  description: string;
  links: IAboutLinksDTO;
}

export interface INamesToIds {
  [symbol: string]: string;
}

export interface ICoinPaprikaAsset {
  id: string;
  name: string;
  symbol: string;
  rank: string;
  is_active: boolean;
}

export interface IMarketAssetIdMap {
  coincap_id: string | null;
  coinpaprika_id: string | null;
}
