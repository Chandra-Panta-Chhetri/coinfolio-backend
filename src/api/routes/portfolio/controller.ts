import { NextFunction, Request, Response } from "express";
import ERROR_MESSAGES from "../../../constants/error-messages";
import { ErrorType } from "../../../enums/error";
import ErrorService from "../../../services/error";
import PortfolioService from "../../../services/portfolio";

export const getPortfolios = async (req: Request, res: Response, next: NextFunction) => {
  const ps = new PortfolioService();
  const portfoliosRes = await ps.getAll(req.user!);
  const portfolios = ps.toPortfoliosDTO(portfoliosRes);
  res.send(portfolios);
};

export const createPortfolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ps = new PortfolioService();
    const createdPortfolio = await ps.create(req.user!, req.body);
    const formattedPortfolio = ps.toPortfolioDTO(createdPortfolio);
    res.send(formattedPortfolio);
  } catch (err) {
    next(err);
  }
};

export const getPortfolioByID = async (req: Request, res: Response, next: NextFunction) => {
  const ps = new PortfolioService();
  const portfolioRes = await ps.getByID(req.user!, req.params.id);
  const portfolio = portfolioRes;
  res.send(portfolio);
};

export const updatePortfolioByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ps = new PortfolioService();
    const portfolioRes = await ps.updateByID(req.user!, req.params.id, req.body);
    const updatedPortfolio = ps.toPortfolioDTO(portfolioRes);
    res.send(updatedPortfolio);
  } catch (err) {
    next(err);
  }
};

export const deletePortfolioByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ps = new PortfolioService();
    const portfolioRes = await ps.deleteByID(req.user!, req.params.id);
    const deletedPortfolio = ps.toPortfolioDTO(portfolioRes);
    res.send(deletedPortfolio);
  } catch (err) {
    next(err);
  }
};
