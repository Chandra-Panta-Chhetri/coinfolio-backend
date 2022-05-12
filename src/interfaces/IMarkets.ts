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

interface ISummaryLabelValue {
  label: string;
  value: string;
}

export interface IMarketSummaryDTO {
  totalMarketCap: ISummaryLabelValue;
  volume24hr: ISummaryLabelValue;
  numExchanges: ISummaryLabelValue;
  numAssets: ISummaryLabelValue;
  btcDom: ISummaryLabelValue;
  ethDom: ISummaryLabelValue;
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

export interface IAssetsQueryParams {
  search?: string;
  limit?: number;
}

export interface IMarketAssetsDTO {
  data: IMarketAssetDTO[];
}

export interface IGetGainersLosersQueryParams {
  limit?: number;
}

export interface IMarketGainersLosersRes {
  data: {
    assets: {
      edges: { node: IMarketAsset }[];
    };
  };
}

export interface IMarketGainersLosersMerged {
  gainers: IMarketGainersLosersRes;
  losers: IMarketGainersLosersRes;
}

export interface IMarketGainersLosersDTO {
  gainers: IMarketAssetDTO[];
  losers: IMarketAssetDTO[];
}
