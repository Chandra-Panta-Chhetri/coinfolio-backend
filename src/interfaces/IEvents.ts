export interface IGetEventsQuery {
  page?: number;
  max?: number;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  showOnly?: string;
  coins?: string;
}

export interface IEventsStatus {
  error_code: number;
  error_message: string;
}

interface IEventsMetaData {
  max: number;
  page: number;
  page_count: number;
  total_count: number;
}

interface IEventCategory {
  id: number;
  name: string;
}

export interface IEventCoin {
  id: string;
  name: string;
  symbol: string;
  fullname: string;
}

export interface IEventCoinDTO {
  id: string;
  name: string;
  symbol: string;
  fullname: string;
  iconURL: string;
}

interface IEventTranslation {
  en: string;
}

interface IGetEventsBody {
  id: number;
  date_event: string;
  can_occur_before: boolean;
  proof: string;
  source: string;
  categories: IEventCategory[];
  coins: IEventCoin[];
  title: IEventTranslation;
}

interface IEventResultsDTO {
  id: number;
  date: string;
  can_occur_before: boolean;
  title: string;
  category: string;
  coins: IEventCoinDTO[];
  proof: string;
  source: string;
}

export interface IEventsDTO {
  metadata: IEventsMetaData;
  results: IEventResultsDTO[];
}

export interface IGetEventsRes {
  status: IEventsStatus;
  _metadata: IEventsMetaData;
  body: IGetEventsBody[];
}
