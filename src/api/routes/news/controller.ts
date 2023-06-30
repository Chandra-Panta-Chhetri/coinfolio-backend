import { NextFunction, Request, Response } from "express";
import NewsService from "../../../services/news";

export const getNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await NewsService.getNews(req.query);
    const newsDTO = NewsService.toNewsDTO(news);
    res.send(newsDTO);
  } catch (err) {
    next(err);
  }
};
