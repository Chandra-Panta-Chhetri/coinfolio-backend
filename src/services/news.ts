import axios from "axios";
import config from "../config";
import { INewsDTO, INewsFilterQuery, INewsResponse } from "../interfaces/INews";

export default class NewsService {
  constructor() {}

  public async getNews(filterQuery: INewsFilterQuery): Promise<INewsDTO> {
    try {
      const res = await axios.get<INewsResponse>(config.news.baseURL, { params: filterQuery });
      const newsDTO = this.toNewsDTO(res.data);
      return newsDTO;
    } catch (err) {
      return { totalResults: 0, results: [] };
    }
  }

  private toNewsDTO(newsResponse: INewsResponse): INewsDTO {
    return {
      totalResults: newsResponse.count,
      results: newsResponse.results.map((r) => ({
        source: r.source.title,
        title: r.title,
        published: r.published_at,
        url: r.url,
        id: r.id
      }))
    };
  }
}
