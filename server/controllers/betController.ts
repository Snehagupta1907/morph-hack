// controllers/betController.ts
import { Request, Response } from 'express';
import * as betService from '../services/betService';
import * as transactionService from '../services/transactionService';
import { TransactionType } from '../dao/transaction';

export const placeBet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { marketId, position, amount, rangeMin, rangeMax, txHash } = req.body;
    const user = req.body.userAddress; // From auth middleware
    
    const bet = await betService.placeBet({
      market: marketId,
      user,
      position,
      amount,
      rangeMin,
      rangeMax,
    });
    
    // Record transaction
    await transactionService.createTransaction(
      user,
      TransactionType.PLACE_BET,
      amount,
      txHash,
      marketId,
      bet._id.toString(),
    );
    
    res.status(201).json(bet);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserBets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userAddress } = req.params;
    
    const bets = await betService.getUserBets(userAddress);
    
    res.status(200).json(bets);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userAddress } = req.params;
    
    const portfolio = await betService.getUserPortfolio(userAddress);
    
    res.status(200).json(portfolio);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const claimWinnings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { betId, txHash } = req.body;
    const user = req.body.userAddress; // From auth middleware
    
    // Logic to claim winnings would go here
    // This would interact with smart contracts in a real implementation
    
    // Record transaction
    await transactionService.createTransaction(
      user,
      TransactionType.CLAIM_WINNINGS,
      0, // Amount would be set based on actual winnings
      txHash,
      undefined,
      betId
    );
    
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

