export interface IGetNewsFilterQuery {
  filter?: string;
  currencies?: string;
  kind?: string;
  page?: number;
}

interface IGetNewsResultsDTO {
  source: string;
  title: string;
  published: string;
  url: string;
  id: number;
}

export interface IGetNewsDTO {
  totalResults: number;
  results: IGetNewsResultsDTO[];
}

interface IGetNewsSource {
  title: string;
  region: string;
  domain: string;
  path: string;
}

interface IGetNewsResults {
  source: IGetNewsSource;
  title: string;
  published_at: string;
  url: string;
  id: number;
}

export interface IGetNews {
  count: number;
  next: string;
  previous: string;
  results: IGetNewsResults[];
}
