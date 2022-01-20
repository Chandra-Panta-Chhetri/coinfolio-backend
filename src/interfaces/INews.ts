export interface INewsFilterQuery {
  filter?: string;
  currencies?: string;
  kind?: string;
  page?: number;
}

interface INewsResDTO {
  source: string;
  title: string;
  published: string;
  url: string;
  id: number;
}

export interface INewsDTO {
  totalResults: number;
  results: INewsResDTO[];
}

interface INewsResSource {
  title: string;
  region: string;
  domain: string;
  path: string;
}

interface INewsResResults {
  source: INewsResSource;
  title: string;
  published_at: string;
  url: string;
  id: number;
}

export interface INewsResponse {
  count: number;
  next: string;
  previous: string;
  results: INewsResResults[];
}
