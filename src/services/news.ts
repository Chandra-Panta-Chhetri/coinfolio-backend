import axios from "../config/axios";
import config from "../config";
import { IGetNewsDTO, IGetNews } from "../interfaces/INews";
import { IGetNewsQuery } from "../api/routes/news/req-schemas";
import ErrorService from "./error";
import { ErrorType } from "../enums/error";
import ERROR_MESSAGES from "../constants/error-messages";

export default class NewsService {
  constructor() {}

  static async getNews(query: IGetNewsQuery) {
    try {
      const res = await axios.get<IGetNews>(config?.newsAPI?.cryptoPanic, {
        params: { ...query, ...config?.newsAPI?.params }
      });
      return res.data;
    } catch (err) {
      throw new ErrorService(ErrorType.Failed, ERROR_MESSAGES.GENERIC);
    }
  }

  static toNewsDTO(newsRes: IGetNews): IGetNewsDTO {
    return {
      totalResults: newsRes?.count,
      results: newsRes?.results?.map((r) => ({
        source: r?.source.title,
        title: r?.title,
        published: r?.published_at,
        url: r?.url,
        id: r?.id
      }))
    };
  }
}
