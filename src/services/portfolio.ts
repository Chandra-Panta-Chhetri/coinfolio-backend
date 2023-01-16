import ERROR_MESSAGES from "../constants/error-messages";
import { ErrorType } from "../enums/error";
import {
  ICreatePortfolio,
  IPortfolio,
  IPortfolioDTO,
  IPortfoliosDTO,
  IUpdatePortfolio
} from "../interfaces/IPortfolio";
import { IRequestUser } from "../interfaces/IUser";
import db from "../loaders/db";
import ErrorService from "./error";

export default class PortfolioService {
  constructor() {}

  async create(user: IRequestUser, newPortfolio: ICreatePortfolio): Promise<IPortfolio> {
    try {
      const createdPortfolios = await db("portfolio")
        .insert({
          is_deleted: false,
          nickname: newPortfolio.nickname,
          user_id: user.id
        })
        .returning<IPortfolio[]>("*");
      if (createdPortfolios.length > 0) {
        return createdPortfolios[0];
      } else {
        throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_CREATE);
      }
    } catch (err) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_CREATE);
    }
  }

  async getAll(user: IRequestUser): Promise<IPortfolio[]> {
    try {
      const portfolios = await db.select<IPortfolio[]>("*").from("portfolio").where({
        user_id: user.id,
        is_deleted: false
      });
      return portfolios;
    } catch (err) {
      return [];
    }
  }

  toPortfolioDTO(portfolio: IPortfolio): IPortfolioDTO {
    return {
      nickname: portfolio.nickname,
      id: portfolio.id
    };
  }

  toPortfoliosDTO(portfolios: IPortfolio[]): IPortfoliosDTO {
    return {
      data: portfolios.map((p) => this.toPortfolioDTO(p))
    };
  }

  async getByID(user: IRequestUser, id: string) {}

  async updateByID(user: IRequestUser, id: string, requestedUpdates: IUpdatePortfolio): Promise<IPortfolio> {
    try {
      const updatedPortfolios = await db("portfolio")
        .where({
          user_id: user.id,
          id
        })
        .update(requestedUpdates)
        .returning<IPortfolio[]>("*");

      if (updatedPortfolios.length > 0) {
        return updatedPortfolios[0];
      } else {
        throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_UPDATE);
      }
    } catch (err) {
      console.log(err);
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_UPDATE);
    }
  }

  async deleteByID(user: IRequestUser, id: string): Promise<IPortfolio> {
    try {
      const deletedPortfolio = await this.updateByID(user, id, { is_deleted: true });
      return deletedPortfolio;
    } catch (err) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_DELETE);
    }
  }
}
