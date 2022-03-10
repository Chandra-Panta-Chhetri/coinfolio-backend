import axios from "../config/axios";
import {
  IGetEventsFilterQuery,
  IGetEventsDTO,
  IGetEvents,
  IEventsStatus,
  IEventCoin,
  IEventCoinDTO
} from "../interfaces/IEvents";
import config from "../config";
import { AxiosError } from "axios";

export default class EventsService {
  constructor() {}

  public async getEvents(filterQuery: IGetEventsFilterQuery): Promise<IGetEvents | IEventsStatus> {
    try {
      const res = await axios.get<IGetEvents>(`${config.events.baseURL}/events`, {
        params: filterQuery,
        headers: config.events.headers
      });
      return res.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      return axiosError.response!.data.status as IEventsStatus;
    }
  }

  public toGetEventsDTO(eventsRes: IGetEvents): IGetEventsDTO {
    return {
      metadata: eventsRes._metadata,
      results: eventsRes.body.map((e) => ({
        id: e.id,
        title: e.title.en,
        can_occur_before: e.can_occur_before,
        date: e.date_event,
        coins: e.coins.map((c) => this.toEventCoinDTO(c)),
        category: e.categories[0].name || ""
      }))
    };
  }

  public toEventCoinDTO(coin: IEventCoin): IEventCoinDTO {
    return {
      iconURL: `${config.icons.baseURL}/${coin.id}_small.png`,
      fullname: coin.fullname,
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol
    };
  }
}
