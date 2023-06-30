import axios from "../config/axios";
import { IEventsDTO, IGetEventsRes, IEventsStatus, IEventCoin, IEventCoinDTO } from "../interfaces/IEvents";
import config from "../config";
import { AxiosError } from "axios";
import { IGetEventsQuery } from "../api/routes/events/req-schemas";
import ErrorService from "./error";
import { ErrorType } from "../enums/error";

export default class EventService {
  constructor() {}

  static async getEvents(query: IGetEventsQuery) {
    try {
      const res = await axios.get<IGetEventsRes>(`${config.eventsAPI.coinMarketCal}/events`, {
        params: query,
        headers: config.eventsAPI.headers
      });
      return res.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      const formattedError = (axiosError.response!.data as IGetEventsRes).status as IEventsStatus;
      throw new ErrorService(ErrorType.Failed, formattedError.error_message, formattedError.error_code);
    }
  }

  static toEventsDTO(eventsRes: IGetEventsRes): IEventsDTO {
    return {
      metadata: eventsRes?._metadata,
      results: eventsRes?.body?.map((e) => ({
        id: e?.id,
        title: e?.title.en,
        can_occur_before: e?.can_occur_before,
        date: e?.date_event,
        coins: e?.coins?.map((c) => this.toEventCoinDTO(c)),
        category: e?.categories[0]?.name || "",
        proof: e?.proof,
        source: e?.source
      }))
    };
  }

  static toEventCoinDTO(coin: IEventCoin): IEventCoinDTO {
    return {
      iconURL: this.toEventImageURL(coin?.id),
      fullname: coin?.fullname,
      id: coin?.id,
      name: coin?.name,
      symbol: coin?.symbol
    };
  }

  static toEventImageURL(coinId: string) {
    return `${config?.icons?.events}/${coinId}_small.png`;
  }
}
