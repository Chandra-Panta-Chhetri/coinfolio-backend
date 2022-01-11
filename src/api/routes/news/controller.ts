import { NextFunction, Request, Response } from "express";
import NewsService from "../../../services/news";

export const index = async (req: Request, res: Response, next: NextFunction) => {
  const ns = new NewsService();
  const news = await ns.getNews(req.query);
  res.send(news);
};
