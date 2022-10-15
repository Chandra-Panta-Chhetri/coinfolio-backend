import { NextFunction, Request, Response } from "express";
import { ErrorType } from "../../../enums/error";
import ErrorService from "../../../services/error";
import NewsService from "../../../services/news";

export const index = async (req: Request, res: Response, next: NextFunction) => {
  const ns = new NewsService();
  const newsRes = await ns.getNews(req.query);
  const test = 2;
  const news = ns.toGetNewsDTO(newsRes);
  res.send(news);
};
