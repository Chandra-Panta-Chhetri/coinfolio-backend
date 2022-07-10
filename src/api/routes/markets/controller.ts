import { Request, Response } from "express";
import MarketsService from "../../../services/markets";

export const getMarkets = async (req: Request, res: Response) => {
  const ms = new MarketsService();
  const marketsRes = await ms.getMarkets(req.query);
  const markets = ms.mapMarketsGraphqlToMarketsDTO(marketsRes);
  res.send(markets);
};

export const getAssetsByKeyword = async (req: Request, res: Response) => {
  const ms = new MarketsService();
  const assetsRes = await ms.getAssets(req.query);
  const assets = ms.mapMarketAssetsToSearchAssetsDTO(assetsRes);
  res.send(assets);
};

export const getSummary = async (req: Request, res: Response) => {
  const ms = new MarketsService();
  const summaryRes = await ms.getSummary();
  const summary = ms.toSummaryDTO(summaryRes);
  res.send(summary);
};

export const getTopCoins = async (req: Request, res: Response) => {
  const ms = new MarketsService();
  const topCoinsRes = await ms.getAssets(req.query);
  const topCoins = ms.mapMarketAssetsToMarketsDTO(topCoinsRes);
  res.send(topCoins);
};

export const getGainersLosers = async (req: Request, res: Response) => {
  const ms = new MarketsService();
  const gainersLosersRes = await ms.getGainersLosers(req.query);
  const gainersLosers = ms.toGainersLosersDTO(gainersLosersRes);
  res.send(gainersLosers);
};

export const getAssetOverview = async (req: Request, res: Response) => {
  const ms = new MarketsService();
  const overviewRes = await ms.getAssetOverview(req.params);
  const overview = ms.toAssetOverviewDTO(overviewRes);
  res.send(overview);
};

export const getAssetExchanges = async (req: Request, res: Response) => {
  const ms = new MarketsService();
  const exchangesRes = await ms.getAssetExchanges(req.params, req.query);
  const exchanges = ms.toAssetExchangesDTO(exchangesRes);
  res.send(exchanges);
};

export const getAssetAbout = async (req: Request, res: Response) => {
  const ms = new MarketsService();
  const aboutRes = await ms.getAssetAbout(req.params, req.query);
  const about = ms.toAssetAboutDTO(aboutRes);
  res.send(about);
};
