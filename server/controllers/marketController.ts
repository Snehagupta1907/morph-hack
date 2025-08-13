// controllers/marketController.ts
import { Request, Response } from "express";
import * as marketService from "../services/marketService";
import * as transactionService from "../services/transactionService";
import { TransactionType } from "../dao/transaction";
import { calculateMarketPercentages } from "../utils/helpers";

export const createMarket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
  
    const {
      marketName,
      link,
      media,
      metric,
      question,
      type,
      minRange,
      maxRange,
      startTime,
      endTime,
      txHash,
    } = req.body;

    const creator = req.body.userAddress; // Assuming this is set by auth middleware
    const market = await marketService.createMarket({
      marketName,
      question,
      creator,
      type,
      minRange,
      maxRange,
      link,
      media,
      metric,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    // Record transaction
    await transactionService.createTransaction(
      creator,
      TransactionType.MARKET_CREATION,
      0, // Market creation might have a fee in the future
      txHash,
      market._id.toString()
    );

    res.status(201).json(market);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllMarkets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, creator, type } = req.query;

    const filters: any = {};
    if (status) filters.status = status;
    if (creator) filters.creator = creator;
    if (type) filters.type = type;

    const markets = await marketService.getAllMarkets(filters);

    // Add percentage data
    const marketsWithPercentages = markets.map((market) => {
      const percentages = calculateMarketPercentages(market);
      return {
        ...market.toObject(),
        percentages,
      };
    });

    res.status(200).json(marketsWithPercentages);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMarketById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const market = await marketService.getMarketById(id);

    if (!market) {
      res.status(404).json({ error: "Market not found" });
      return;
    }

    const percentages = calculateMarketPercentages(market);

    res.status(200).json({
      ...market.toObject(),
      percentages,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const resolveMarket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { outcome, outcomeValue, txHash } = req.body;
    const resolver = req.body.userAddress; // From auth middleware

    const market = await marketService.resolveMarket(
      id,
      resolver,
      outcome,
      outcomeValue
    );

    if (!market) {
      res.status(404).json({ error: "Market not found" });
      return;
    }

    // Record transaction
    await transactionService.createTransaction(
      resolver,
      TransactionType.RESOLVE_MARKET,
      0,
      txHash,
      id
    );

    res.status(200).json(market);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserMarkets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userAddress } = req.params;

    const markets = await marketService.getAllMarkets({ creator: userAddress });

    res.status(200).json(markets);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
