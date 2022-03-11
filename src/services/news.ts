import axios from "../config/axios";
import config from "../config";
import { IGetNewsDTO, IGetNewsFilterQuery, IGetNews } from "../interfaces/INews";

export default class NewsService {
  constructor() {}

  public async getNews(filterQuery: IGetNewsFilterQuery): Promise<IGetNews | null> {
    try {
      const res = await axios.get<IGetNews>(config.news.baseURL, { params: filterQuery });
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
