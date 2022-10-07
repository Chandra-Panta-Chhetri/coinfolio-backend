import axios from "../config/axios";
import config from "../config";
import { IGetNewsDTO, IGetNewsQueryParams, IGetNews } from "../interfaces/INews";

export default class NewsService {
  constructor() {}

  public async getNews(query: IGetNewsQueryParams): Promise<IGetNews> {
    try {
      const res = await axios.get<IGetNews>(config.newsAPI.cryptoPanic, {
        params: { ...query, ...config.newsAPI.params }
      });
      return res.data;
    } catch (err) {
      return {
        count: 0,
        results: [],
        next: "",
        previous: ""
      };
    }
  }

  public toGetNewsDTO(newsRes: IGetNews): IGetNewsDTO {
    return {
      totalResults: newsRes.count,
      results: newsRes.results.map((r) => ({
        source: r.source.title,
        title: r.title,
        published: r.published_at,
        url: r.url,
        id: r.id
      }))
    };
  }
}
