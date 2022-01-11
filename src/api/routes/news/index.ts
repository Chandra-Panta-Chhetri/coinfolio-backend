import { Router, Request, Response, NextFunction } from "express";
import NewsService from "../../../services/news";
import { celebrate } from "celebrate";
import * as reqSchemas from "./req-schemas";

const route = Router();

export default (app: Router) => {
  app.use("/news", route);

  route.get("/", celebrate(reqSchemas.GET_NEWS), async (req: Request, res: Response, next: NextFunction) => {
    const ns = new NewsService();
    const news = await ns.getNews(req.query);
    res.send(news);
  });
};
