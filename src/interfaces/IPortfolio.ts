export interface IPortfolio {
  nickname: string;
  user: number;
  is_deleted: boolean;
  id: number;
}

export interface ICreatePortfolio {
  nickname: string;
}

export interface IPortfolioDTO {
  nickname: string;
  id: number;
}

export interface IUpdatePortfolio {
  nickname?: string;
  is_deleted?: boolean;
}

export interface IPortfoliosDTO {
  data: IPortfolioDTO[];
}
