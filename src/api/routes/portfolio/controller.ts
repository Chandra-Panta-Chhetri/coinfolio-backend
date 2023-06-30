import { NextFunction, Request, Response } from "express";
import ERROR_MESSAGES from "../../../constants/error-messages";
import { ErrorType } from "../../../enums/error";
import ErrorService from "../../../services/error";
import MarketService from "../../../services/market";
import PortfolioService from "../../../services/portfolio";

export const getPortfolios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolios = await PortfolioService.getAll(req.user!);
    const portfoliosDTO = PortfolioService.toPortfoliosDTO(portfolios);
    res.send(portfoliosDTO);
  } catch (err) {
    next(err);
  }
};

export const createPortfolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPortfolio = await PortfolioService.add(req.user!, req.body);
    const newPortfolioDTO = PortfolioService.toPortfolioDTO(newPortfolio);
    res.send(newPortfolioDTO);
  } catch (err) {
    next(err);
  }
};

export const getPortfolioByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolio = await PortfolioService.getByID(req.user!, req.params.id);
    const portfolioDTO = PortfolioService.toPortfolioDTO(portfolio);
    res.send(portfolioDTO);
  } catch (err) {
    next(err);
  }
};

export const updatePortfolioByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedPortfolio = await PortfolioService.updateByID(req.user!, req.params.id, req.body);
    const updatedPortfolioDTO = PortfolioService.toPortfolioDTO(updatedPortfolio);
    res.send(updatedPortfolioDTO);
  } catch (err) {
    next(err);
  }
};

export const deletePortfolioByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedPortfolio = await PortfolioService.deleteByID(req.user!, req.params.id);
    const deletedPortfolioDTO = PortfolioService.toPortfolioDTO(deletedPortfolio);
    res.send(deletedPortfolioDTO);
  } catch (err) {
    next(err);
  }
};

export const getPortfolioOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioId = req.params.id;
    const user = req.user!;
    const hasAccess = await PortfolioService.hasAccess(user, portfolioId);
    if (!hasAccess) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const portfolioOverview = await PortfolioService.getOverview(portfolioId);
    res.send(portfolioOverview);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getSupportedCoins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coins = await PortfolioService.getSupportedCoins(req.query);
    const coinsDTO = MarketService.toSearchAssetsDTO(coins);
    res.send(coinsDTO);
  } catch (err) {
    next(err);
  }
};

export const getPortfolioHoldingOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioId = req.params.id;
    const user = req.user!;
    const hasAccess = await PortfolioService.hasAccess(user, portfolioId);
    if (!hasAccess) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.PORTFOLIO_UNAUTHORIZED_ACTION);
    }
    const holdingOverview = await PortfolioService.getHoldingOverview(portfolioId, req.params.coinId);
    res.send(holdingOverview);
  } catch (err) {
    next(err);
  }
};
