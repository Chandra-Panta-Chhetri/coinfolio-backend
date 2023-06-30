import { NextFunction, Request, Response } from "express";
import MarketService from "../../../services/market";

export const getMarkets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const markets = await MarketService.getMarkets(req.query);
    const marketsDTO = MarketService.mapMarketsGraphqlToMarketsDTO(markets);
    res.send(marketsDTO);
  } catch (err) {
    next(err);
  }
};

export const getAssetsByKeyword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assets = await MarketService.getAssets(req.query);
    const assetsDTO = MarketService.toSearchAssetsDTO(assets);
    res.send(assetsDTO);
  } catch (err) {
    next(err);
  }
};

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await MarketService.getSummary();
    const summaryDTO = MarketService.toSummaryDTO(summary);
    res.send(summaryDTO);
  } catch (err) {
    next(err);
  }
};

export const getTopCoins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topCoins = await MarketService.getAssets(req.query);
    const topCoinsDTO = MarketService.toMarketsDTO(topCoins);
    res.send(topCoinsDTO);
  } catch (err) {
    next(err);
  }
};

export const getGainersLosers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gainersLosers = await MarketService.getGainersLosers(req.query);
    const gainersLosersDTO = MarketService.toGainersLosersDTO(gainersLosers);
    res.send(gainersLosersDTO);
  } catch (err) {
    next(err);
  }
};

export const getAssetOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const overview = await MarketService.getAssetOverview(req.params.id);
    const overviewDTO = MarketService.toAssetOverviewDTO(overview);
    res.send(overviewDTO);
  } catch (err) {
    next(err);
  }
};

export const getAssetExchanges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exchanges = await MarketService.getAssetExchanges(req.params.id, req.query);
    const exchangesDTO = MarketService.toAssetExchangesDTO(exchanges);
    res.send(exchangesDTO);
  } catch (err) {
    next(err);
  }
};

export const getAssetAbout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const about = await MarketService.getAssetAbout(req.params.id);
    const aboutDTO = MarketService.toAssetAboutDTO(about);
    res.send(aboutDTO);
  } catch (err) {
    next(err);
  }
};
