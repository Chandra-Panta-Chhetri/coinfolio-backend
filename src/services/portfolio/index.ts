import { ICreatePortfolioReqBody, IUpdatePortfolioReqBody } from "../../api/routes/portfolio/req-schemas";
import TABLE_NAMES from "../../constants/db-table-names";
import ERROR_MESSAGES from "../../constants/error-messages";
import { ErrorType } from "../../enums/error";
import { IPortfolio, IPortfolioDTO, IPortfoliosDTO } from "../../interfaces/IPortfolio";
import { IRequestUser } from "../../interfaces/IUser";
import db from "../../loaders/db";
import ErrorService from "../error";

export default class PortfolioService {
  constructor() {}

  static async create(user: IRequestUser, newPortfolio: ICreatePortfolioReqBody) {
    const [createdPortfolio] = await db(TABLE_NAMES.PORTFOLIO)
      .insert({
        is_deleted: false,
        nickname: newPortfolio.nickname,
        user_id: user.id
      })
      .returning<IPortfolio[]>("*");
    if (createdPortfolio === undefined) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_CREATE);
    }
    return createdPortfolio;
  }

  static async getAll(user: IRequestUser) {
    const portfolios = await db.select<IPortfolio[]>("*").from(TABLE_NAMES.PORTFOLIO).where({
      user_id: user.id,
      is_deleted: false
    });
    return portfolios;
  }

  static toPortfolioDTO(portfolio: IPortfolio): IPortfolioDTO {
    return {
      nickname: portfolio.nickname,
      id: portfolio.id
    };
  }

  static toPortfoliosDTO(portfolios: IPortfolio[]): IPortfoliosDTO {
    return {
      data: portfolios.map((p) => this.toPortfolioDTO(p))
    };
  }

  static async getByID(user: IRequestUser, id: string) {
    const [portfolio] = await db.select<IPortfolio[]>("*").from(TABLE_NAMES.PORTFOLIO).where({
      user_id: user.id,
      id
    });
    if (portfolio === undefined) {
      throw new ErrorService(ErrorType.BadRequest, `Portfolio with id ${id} does not exist`);
    }
    return portfolio;
  }

  static async updateByID(user: IRequestUser, id: string, updates: IUpdatePortfolioReqBody) {
    const [updatedPortfolio] = await db(TABLE_NAMES.PORTFOLIO)
      .update(updates)
      .where({
        user_id: user.id,
        id
      })
      .returning<IPortfolio[]>("*");
    if (updatedPortfolio === undefined) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_UPDATE);
    }
    return updatedPortfolio;
  }

  static async deleteByID(user: IRequestUser, id: string) {
    try {
      const deletedPortfolio = await this.updateByID(user, id, { is_deleted: true });
      return deletedPortfolio;
    } catch (err) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_DELETE);
    }
  }
}
