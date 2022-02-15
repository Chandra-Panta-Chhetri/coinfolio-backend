export interface IGetEventsFilterQuery {
  page?: number;
  max?: number;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  showOnly?: string;
}

export interface IEventsStatus {
  error_code: number;
  error_message: string;
}

interface IGetEventsMetaData {
  max: number;
  page: number;
  page_count: number;
  total_count: number;
}

interface IEventsCategory {
  id: number;
  name: string;
}

interface IEventsCoin {
  id: number;
  name: string;
  symbol: string;
  fullname: string;
}

interface IEventsTranslation {
  en: string;
}

interface IGetEventsBody {
  id: number;
  date_event: string;
  can_occur_before: boolean;
  proof: string;
  source: string;
  categories: IEventsCategory[];
  coins: IEventsCoin[];
  title: IEventsTranslation;
}

interface IGetEventsResultsDTO {
  id: number;
  date_event: string;
  can_occur_before: boolean;
  title: string;
  category: string;
  coins: IEventsCoin[];
}

export interface IGetEventsDTO {
  _metadata: IGetEventsMetaData;
  results: IGetEventsResultsDTO[];
}

export interface IGetEvents {
  status: IEventsStatus;
  _metadata: IGetEventsMetaData;
  body: IGetEventsBody[];
}
