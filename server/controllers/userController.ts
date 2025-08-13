// controllers/userController.ts (enhanced)
import { Request, Response } from 'express';
import * as userService from '../services/userService';
import * as betService from '../services/betService';

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address } = req.params;
    
    const user = await userService.getUserByAddress(address);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address } = req.body;
    
    const user = await userService.createUser(address);
    
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    const leaderboard = await userService.getLeaderboard(limit);
    
    res.status(200).json(leaderboard);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address } = req.params;
    
    const activity = await userService.getUserActivity(address);
    
    if (!activity) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json(activity);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address } = req.params;
    
    const portfolio = await betService.getUserPortfolio(address);
    
    res.status(200).json(portfolio);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    
    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};