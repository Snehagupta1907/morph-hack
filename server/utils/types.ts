// utils/types.ts
export interface MarketCreateParams {
  marketName: string;
  media: string;
  metric: string;
  link: string;
  question: string;
  creator: string;
  type: number;
  minRange?: number;
  maxRange?: number;
  startTime: Date;
  endTime: Date;
}

export interface BetCreateParams {
  market: string;
  user: string;
  position: string;
  amount: number;
  rangeMin?: number;
  rangeMax?: number;
}

export interface MarketFilters {
  status?: string;
  creator?: string;
  type?: string;
}

export interface UserPortfolio {
  totalBets: number;
  activeBets: number;
  wonBets: number;
  lostBets: number;
  totalAmountBet: number;
  totalWinnings: number;
  totalLosses: number;
  netProfit: number;
}

export interface LeaderboardEntry {
  user: string;
  totalBets: number;
  wonBets: number;
  winRate: number;
  totalProfit: number;
}
