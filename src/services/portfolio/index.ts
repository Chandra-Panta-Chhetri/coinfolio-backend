import {
  ICreatePortfolioReqBody,
  IGetTrackableCoinsQuery,
  IUpdatePortfolioReqBody
} from "../../api/routes/portfolio/req-schemas";
import TABLE_NAMES from "../../constants/db-table-names";
import ERROR_MESSAGES from "../../constants/error-messages";
import { ErrorType } from "../../enums/error";
import {
  IPortfolio,
  IPortfolioDTO,
  IPortfolioHolding,
  IPortfolioHoldingDTO,
  IPortfolioOverview,
  IPortfolioPieChartDTO,
  IPortfoliosDTO,
  IPortfolioStats
} from "../../interfaces/IPortfolio";
import { IRequestUser } from "../../interfaces/IUser";
import db from "../../loaders/db";
import ErrorService from "../error";
import MarketService from "../market";
import PTransactionService from "./transaction";

const MAX_ALLOCATIONS_TO_CALCULATE = 5;

export default class PortfolioService {
  constructor() {}

  private static async create(portfolios: Partial<IPortfolio> | Partial<IPortfolio>[]) {
    try {
      const newPortfolios = await db(TABLE_NAMES.PORTFOLIO).insert(portfolios).returning<IPortfolio[]>("*");
      return newPortfolios;
    } catch (err) {
      return [];
    }
  }

  private static async findWhere(criteria: Partial<IPortfolio>) {
    try {
      const portfolios = await db.select<IPortfolio[]>("*").from(TABLE_NAMES.PORTFOLIO).where(criteria);
      return portfolios;
    } catch (err) {
      return [];
    }
  }

  private static async updateWhere(update: Partial<IPortfolio>, criteria: Partial<IPortfolio>) {
    try {
      const updatedPortfolios = await db(TABLE_NAMES.PORTFOLIO)
        .update(update)
        .where(criteria)
        .returning<IPortfolio[]>("*");
      return updatedPortfolios;
    } catch (err) {
      return [];
    }
  }

  private static async getPieCharts(user: IRequestUser, portfolioId: string) {}

  static async add(user: IRequestUser, newPortfolio: ICreatePortfolioReqBody) {
    const [createdPortfolio] = await this.create({
      is_deleted: false,
      nickname: newPortfolio.nickname,
      user_id: user.id
    });
    if (createdPortfolio === undefined) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PORTFOLIO_CREATE);
    }
    return createdPortfolio;
  }

  static async getAll(user: IRequestUser) {
    const portfolios = await this.findWhere({
      user_id: user.id,
      is_deleted: false
    });
    return portfolios;
  }

  static toPortfolioDTO(portfolio: IPortfolio): IPortfolioDTO {
    return {
      nickname: portfolio.nickname,
      id: +portfolio.id
    };
  }

  static toPortfoliosDTO(portfolios: IPortfolio[]): IPortfoliosDTO {
    return {
      data: portfolios.map((p) => this.toPortfolioDTO(p))
    };
  }

  static async getByID(user: IRequestUser, id: string) {
    const [portfolio] = await this.findWhere({
      user_id: user.id,
      id: +id,
      is_deleted: false
    });
    if (portfolio === undefined) {
      throw new ErrorService(ErrorType.NotFound, `Portfolio with id ${id} does not exist`);
    }
    return portfolio;
  }

  static async calculateStats(assets: IPortfolioHolding[]): Promise<IPortfolioStats | null> {
    try {
      const assetIds = assets.map((a) => a.coin_id).join(",");
      const currentDataForAssets = await MarketService.getAssets({ ids: assetIds });
      const assetsWithStats = assets.map<IPortfolioHoldingDTO>((a) => {
        const correspondingAsset = currentDataForAssets.find((assetData) => assetData.id === a.coin_id);
        if (correspondingAsset !== undefined) {
          const currentAssetDTO = MarketService.toMarketAssetDTO(correspondingAsset);
          const totalValue = +a.amount * +currentAssetDTO.priceUsd;
          const profitLoss = totalValue - +a.total_cost;
          return {
            totalCost: a.total_cost,
            coinId: a.coin_id,
            amount: a.amount,
            priceUSD: {
              value: correspondingAsset.priceUsd,
              percentChange: correspondingAsset.changePercent24Hr
            },
            profitLoss: {
              value: `${profitLoss}`,
              percentChange: `${+a.total_cost === 0 ? 0 : (profitLoss / +a.total_cost) * 100}`
            },
            totalValue: `${totalValue}`,
            avgCost: a.avg_cost,
            coinSymbol: currentAssetDTO.symbol,
            coinName: currentAssetDTO.name,
            coinURL: currentAssetDTO.image
          };
        } else {
          throw new ErrorService(ErrorType.Failed, `Could not find corresponding current data for ${a.coin_id}`);
        }
      });
      const totalValue = assetsWithStats.reduce(
        (totalValueSoFar, currentAsset) => totalValueSoFar + +currentAsset.totalValue,
        0
      );
      const totalProfitLoss = assetsWithStats.reduce(
        (totalPLSoFar, currentAsset) => totalPLSoFar + +currentAsset.profitLoss.value,
        0
      );
      const totalCost = assetsWithStats.reduce(
        (totalCostSoFar, currentAsset) => totalCostSoFar + +currentAsset.totalCost,
        0
      );
      return {
        totalCost: `${totalCost}`,
        totalValue: `${totalValue}`,
        totalProfitLoss: {
          value: `${totalProfitLoss}`,
          percentChange: `${totalCost === 0 ? 0 : (totalProfitLoss / totalCost) * 100}`
        },
        holdings: assetsWithStats
      };
    } catch (err) {
      return null;
    }
  }

  static calculatePieCharts(portfolioStats: IPortfolioStats) {
    const pieCharts: IPortfolioPieChartDTO[] = [];
    const numHoldings = portfolioStats?.holdings?.length;
    const holdings = portfolioStats?.holdings;
    const totalPortfolioValue = portfolioStats?.totalValue;
    for (let i = 0; i < numHoldings; i++) {
      let holding = holdings[i];
      if (i < MAX_ALLOCATIONS_TO_CALCULATE - 1 || numHoldings <= MAX_ALLOCATIONS_TO_CALCULATE) {
        pieCharts.push({
          coinId: holding.coinId,
          coinName: holding.coinName,
          coinSymbol: holding.coinSymbol,
          totalValue: holding.totalValue,
          percent: `${+holding.totalValue / +totalPortfolioValue}`
        });
      } else {
        const percentSoFar = pieCharts.reduce((acc, currentPieChart) => acc + +currentPieChart.percent, 0);
        const remainingPercent = 1 - percentSoFar;
        const totalValueSoFar = pieCharts.reduce((acc, currentPieChart) => acc + +currentPieChart.totalValue, 0);
        const remainingTotalValue = +totalPortfolioValue - +totalValueSoFar;
        pieCharts.push({
          percent: `${remainingPercent}`,
          coinId: "other",
          coinName: "Other",
          coinSymbol: "Other",
          totalValue: `${remainingTotalValue}`
        });
        break;
      }
    }
    return pieCharts;
  }

  static async getOverview(user: IRequestUser, id: string): Promise<IPortfolioOverview> {
    const portfolioAssets = await PTransactionService.groupByCoin(user, id);
    const portfolioStats = await this.calculateStats(portfolioAssets);
    if (portfolioStats != null) {
      //sort holdings by highest totalValue to lowest
      portfolioStats.holdings.sort((a, b) => (+a.totalValue > +b.totalValue ? -1 : 1));
      const pieCharts = this.calculatePieCharts(portfolioStats);
      return {
        ...portfolioStats,
        pieCharts
      };
    } else {
      throw new ErrorService(ErrorType.Failed, "Failed to calculate stats for portfolio");
    }
  }

  static async updateByID(user: IRequestUser, id: string, updates: IUpdatePortfolioReqBody) {
    const [updatedPortfolio] = await this.updateWhere(updates, {
      user_id: user.id,
      id: +id,
      is_deleted: false
    });
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

  static async getSupportedCoins(query: IGetTrackableCoinsQuery) {
    if (query?.search?.trim() === "") {
      delete query.search;
    }
    const coins = await MarketService.getAssets(query);
    return coins;
  }
}
