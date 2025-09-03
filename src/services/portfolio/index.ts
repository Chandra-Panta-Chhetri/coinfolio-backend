import {
  ICreatePortfolioReqBody,
  IGetTrackableCoinsQuery,
  IUpdatePortfolioReqBody
} from "../../api/routes/portfolio/req-schemas";
import TABLE_NAMES from "../../constants/db-table-names";
import ERROR_MESSAGES from "../../constants/error-messages";
import { ErrorType } from "../../enums/error";
import { IMarketAsset } from "../../interfaces/IMarkets";
import {
  IPHoldingOverview,
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

  static toPortfolioHoldingDTO(holding: IPortfolioHolding, marketDataForHolding?: IMarketAsset): IPortfolioHoldingDTO {
    if (marketDataForHolding !== undefined && marketDataForHolding !== null) {
      const marketAssetDTO = MarketService.toMarketAssetDTO(marketDataForHolding);
      const totalValue = +holding.amount * +marketAssetDTO.priceUsd;
      const profitLoss = totalValue - +holding.total_cost + +holding.total_proceeds;
      return {
        totalCost: holding.total_cost,
        coinId: holding.coin_id,
        amount: holding.amount,
        priceUSD: {
          value: marketDataForHolding.priceUsd,
          percentChange: marketDataForHolding.changePercent24Hr
        },
        profitLoss: {
          value: `${profitLoss}`,
          percentChange: `${+holding.total_cost === 0 ? 0 : (profitLoss / +holding.total_cost) * 100}`
        },
        totalValue: `${totalValue}`,
        avgCost: holding.avg_cost,
        coinSymbol: marketAssetDTO.symbol,
        coinName: marketAssetDTO.name,
        coinURL: marketAssetDTO.image,
        totalProceeds: holding.total_proceeds
      };
    } else {
      return {
        totalCost: holding.total_cost,
        coinId: holding.coin_id,
        amount: holding.amount,
        priceUSD: {
          value: "0.00",
          percentChange: "0.00"
        },
        profitLoss: {
          value: `0.00`,
          percentChange: `0.00`
        },
        totalValue: `0.00`,
        avgCost: holding.avg_cost,
        coinSymbol: "",
        coinName: "",
        coinURL: "",
        totalProceeds: holding.total_proceeds
      };
    }
  }

  static toPortfolioHoldingDTOs(holdings: IPortfolioHolding[], marketDataForHoldings: IMarketAsset[]) {
    return holdings.map((holding) => {
      const marketDataForHolding = marketDataForHoldings.find((md) => md.id === holding.coin_id);
      return this.toPortfolioHoldingDTO(holding, marketDataForHolding);
    });
  }

  static async calculateStats(holdingDTOs: IPortfolioHoldingDTO[]): Promise<IPortfolioStats> {
    const totalValue = holdingDTOs.reduce(
      (totalValueSoFar, currentAsset) => totalValueSoFar + +currentAsset.totalValue,
      0
    );
    const totalProfitLoss = holdingDTOs.reduce(
      (totalPLSoFar, currentAsset) => totalPLSoFar + +currentAsset.profitLoss.value,
      0
    );
    const totalCost = holdingDTOs.reduce((totalCostSoFar, currentAsset) => totalCostSoFar + +currentAsset.totalCost, 0);
    return {
      totalCost: `${totalCost}`,
      totalValue: `${totalValue}`,
      totalProfitLoss: {
        value: `${totalProfitLoss}`,
        percentChange: `${totalCost === 0 ? 0 : (totalProfitLoss / totalCost) * 100}`
      }
    };
  }

  static calculatePieCharts(portfolioStats: IPortfolioStats, holdingDTOs: IPortfolioHoldingDTO[]) {
    const pieCharts: IPortfolioPieChartDTO[] = [];
    const nonZeroHoldings = holdingDTOs?.filter((holding) => +holding.totalValue > 0);
    const numHoldings = nonZeroHoldings?.length;
    const totalPortfolioValue = portfolioStats?.totalValue;
    for (let i = 0; i < numHoldings; i++) {
      let holding = nonZeroHoldings[i];
      if (i < MAX_ALLOCATIONS_TO_CALCULATE - 1 || numHoldings <= MAX_ALLOCATIONS_TO_CALCULATE) {
        pieCharts.push({
          coinId: holding.coinId,
          coinName: holding.coinName,
          coinSymbol: holding.coinSymbol,
          totalValue: holding.totalValue,
          percent: `${(+holding.totalValue / +totalPortfolioValue) * 100}`
        });
      } else {
        const percentSoFar = pieCharts.reduce((acc, currentPieChart) => acc + +currentPieChart.percent, 0);
        const remainingPercent = 100 - percentSoFar;
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

  static async hasAccess(user: IRequestUser, portfolioId: string) {
    try {
      await this.getByID(user, portfolioId);
      return true;
    } catch (err) {
      return false;
    }
  }

  static async getHoldings(portfolioId: string, coinIds?: string[]) {
    const holdings = await PTransactionService.groupByCoin(portfolioId, coinIds);
    const holdingIds = holdings.map((h) => h.coin_id).join(",");
    const marketDataForHoldings = await MarketService.getAssets({ ids: holdingIds });
    const holdingDTOs = this.toPortfolioHoldingDTOs(holdings, marketDataForHoldings);
    return holdingDTOs;
  }

  static async getOverview(id: string): Promise<IPortfolioOverview> {
    const holdings = await this.getHoldings(id);
    const portfolioStats = await this.calculateStats(holdings);
    //sort holdings by highest totalValue to lowest
    holdings.sort((a, b) => (+a.totalValue > +b.totalValue ? -1 : 1));
    const pieCharts = this.calculatePieCharts(portfolioStats, holdings);
    return {
      holdings,
      pieCharts,
      ...portfolioStats
    };
  }

  static async getHoldingOverview(id: string, coinId: string): Promise<IPHoldingOverview> {
    const getHoldingReq = this.getHoldings(id, [coinId]);
    const getTransactionsReq = PTransactionService.getMany(id, { coinId });
    const [[holdingDTO], transactions] = await Promise.all([getHoldingReq, getTransactionsReq]);
    if (holdingDTO === undefined || holdingDTO === null) {
      throw new ErrorService(ErrorType.NotFound, `Coin with id ${coinId} not found in Portfolio`);
    }
    const transactionDTOs = PTransactionService.toTransactionDTOs(transactions);
    return { summary: holdingDTO, transactions: transactionDTOs };
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
