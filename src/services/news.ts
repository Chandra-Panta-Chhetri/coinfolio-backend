import axios from "../config/axios";
import config from "../config";
import { IGetNewsDTO, IGetNewsQueryParams, IGetNews } from "../interfaces/INews";

export default class NewsService {
  constructor() {}

  public async getNews(query: IGetNewsQueryParams): Promise<IGetNews | null> {
    try {
      const res = await axios.get<IGetNews>(config.newsAPI.baseURL, { params: query });
      return res.data;
    } catch (err) {
      return null;
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
