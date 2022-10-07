import axios from "../config/axios";
import {
  IGetEventsQuery,
  IEventsDTO,
  IGetEventsRes,
  IEventsStatus,
  IEventCoin,
  IEventCoinDTO
} from "../interfaces/IEvents";
import config from "../config";
import { AxiosError } from "axios";
import { toEventImageURL } from "../api/utils";

export default class EventsService {
  constructor() {}

  public async getEvents(query: IGetEventsQuery): Promise<IGetEventsRes | IEventsStatus> {
    try {
      const res = await axios.get<IGetEventsRes>(`${config.eventsAPI.coinMarketCal}/events`, {
        params: query,
        headers: config.eventsAPI.headers
      });
      return res.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      return (axiosError.response!.data as IGetEventsRes).status as IEventsStatus;
    }
  }

  public toGetEventsDTO(eventsRes: IGetEventsRes): IEventsDTO {
    return {
      metadata: eventsRes._metadata,
      results: eventsRes.body.map((e) => ({
        id: e.id,
        title: e.title.en,
        can_occur_before: e.can_occur_before,
        date: e.date_event,
        coins: e.coins.map((c) => this.toEventCoinDTO(c)),
        category: e.categories[0].name || "",
        proof: e.proof,
        source: e.source
      }))
    };
  }

  public toEventCoinDTO(coin: IEventCoin): IEventCoinDTO {
    return {
      iconURL: toEventImageURL(coin.id),
      fullname: coin.fullname,
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol
    };
  }
}
