import { NextFunction, Request, Response } from "express";
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
