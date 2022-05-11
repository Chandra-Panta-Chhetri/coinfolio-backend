interface IMarketTotal {
  marketCapUsd: string;
  exchangeVolumeUsd24Hr: string;
  exchanges: string;
  markets: string;
  assets: string;
}

interface AssetSummary {
  marketCapUsd: string;
}

export interface IMarketsSummaryRes {
  data: {
    marketTotal: IMarketTotal;
    btc: AssetSummary;
    eth: AssetSummary;
  };
}

interface ILabelValue {
  label: string;
  value: string;
}

export interface IMarketsSummaryDTO {
  totalMarketCap: ILabelValue;
  volume24hr: ILabelValue;
  numExchanges: ILabelValue;
  numAssets: ILabelValue;
  btcDom: ILabelValue;
  ethDom: ILabelValue;
}

export interface IMarketsAsset {
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

export interface IGrahpqlQueryBody {
  variables?: Object;
  query: string;
}

export interface IMarketsAssetDTO {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  changePercent24Hr: number;
  image: string;
}

export interface IAssetsRes {
  data: IMarketsAsset[];
}

export interface IAssetSearch {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

export interface ISearchAssetsDTO {
  data: IAssetSearch[];
}

export interface IAssetsFilterQuery {
  search?: string;
  limit?: number;
}

export interface IAssetsDTO {
  data: IMarketsAssetDTO[];
}

export interface IGetGainersLosersFilterQuery {
  limit?: number;
}

export interface IMarketsGainersLosersRes {
  data: {
    assets: {
      edges: { node: IMarketsAsset }[];
    };
  };
}

export interface IMarketsGainersLosersMerged {
  gainers: IMarketsGainersLosersRes;
  losers: IMarketsGainersLosersRes;
}

export interface IMarketsGainersLosersDTO {
  gainers: IMarketsAssetDTO[];
  losers: IMarketsAssetDTO[];
}
