import { NextFunction, Request, Response } from "express";
import NewsService from "../../../services/news";

export const index = async (req: Request, res: Response, next: NextFunction) => {
  const ns = new NewsService();
  const newsRes = await ns.getNews(req.query);
  if (newsRes === null) {
    return next();
  }
  const news = ns.toGetNewsDTO(newsRes);
  res.send(news);
};
