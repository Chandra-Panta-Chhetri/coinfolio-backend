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
import postgres from "../loaders/postgres";
import ErrorService from "./error";

export default class PortfolioService {
  constructor() {}

  async create(user: IRequestUser, newPortfolio: ICreatePortfolio): Promise<IPortfolio> {
    try {
      const portfolios = await postgres<IPortfolio[]>`
      INSERT INTO portfolio (is_deleted, nickname, user_id)
      VALUES (false, ${newPortfolio.nickname}, ${user.id})
      RETURNING *`;
      if (portfolios.length > 0) {
        return portfolios[0];
      } else {
        throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_CREATE);
      }
    } catch (err) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_CREATE);
    }
  }

  async getAll(user: IRequestUser): Promise<IPortfolio[]> {
    try {
      const portfolios = await postgres<IPortfolio[]>`
      SELECT * FROM portfolio
      WHERE user_id=${user.id} AND is_deleted=false
      `;
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
      const { nickname, is_deleted } = requestedUpdates;
      if (nickname === undefined && is_deleted === undefined) {
        throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_UPDATE);
      }

      const updatedPortfolios = await postgres`
        UPDATE portfolio
        SET ${postgres(requestedUpdates, "is_deleted", "nickname")}
        WHERE user_id=${user.id} AND id=${id}
        RETURNING *`;

      if (updatedPortfolios.length > 0) {
        return updatedPortfolios[0] as IPortfolio;
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
