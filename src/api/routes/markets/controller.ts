import { NextFunction, Request, Response } from "express";
import MarketsService from "../../../services/markets";

export const getMarkets = async (req: Request, res: Response, next: NextFunction) => {
  const ms = new MarketsService();
  const summaryRes = await ms.getSummary();
  const summary = ms.toSummaryDTO(summaryRes);
  res.send(summary);
};

export const getAssetsByKeyword = async (req: Request, res: Response, next: NextFunction) => {
  const ms = new MarketsService();
  const assetsRes = await ms.getAssets(req.query);
  const assets = ms.toSearchAssetsDTO(assetsRes);
  res.send(assets);
};

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  const ms = new MarketsService();
  const summaryRes = await ms.getSummary();
  const summary = ms.toSummaryDTO(summaryRes);
  res.send(summary);
};

export const getTopCoins = async (req: Request, res: Response, next: NextFunction) => {
  const ms = new MarketsService();
  const topCoinsRes = await ms.getAssets(req.query);
  const topCoins = ms.toAssetsDTO(topCoinsRes);
  res.send(topCoins);
};

export const getGainersLosers = async (req: Request, res: Response, next: NextFunction) => {
  const ms = new MarketsService();
  const gainersLosersRes = await ms.getGainersLosers(req.query);
  const gainersLosers = ms.toGainersLosersDTO(gainersLosersRes);
  res.send(gainersLosers);
};
