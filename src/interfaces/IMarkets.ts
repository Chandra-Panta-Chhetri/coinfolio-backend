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

export interface IMarketsSummaryDTO {
  totalMarketCap: string;
  volume24hr: string;
  numExchanges: string;
  numAssets: string;
  btcDom: string;
  ethDom: string;
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

export interface IMarketsAssetDTO {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
}

export interface IMarketsTopCoinsRes {
  data: IMarketsAsset[];
}

export interface IMarketsTopCoinsDTO {
  data: IMarketsAssetDTO[];
}

export interface IGetTopCoinsFilterQuery {
  limit?: number;
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
