// utils/helpers.ts
import { MarketType, IMarket } from '../dao/market';
import { BetPosition, IBet } from '../dao/bet';

export const calculatePotentialPayout = (
  market: IMarket,
  bet: { position: string; amount: number; rangeMin?: number; rangeMax?: number }
): number => {
  if (market.type === MarketType.BINARY) {
    // For binary markets
    const { position, amount } = bet;
    const yesPool = market.yesPool;
    const noPool = market.noPool;
    const totalPool = yesPool + noPool + amount;

    if (position === BetPosition.YES) {
      // Calculate potential payout for YES position
      return (amount / (yesPool + amount)) * totalPool;
    } else {
      // Calculate potential payout for NO position
      return (amount / (noPool + amount)) * totalPool;
    }
  } else {
    // For range markets
    const { rangeMin, rangeMax, amount } = bet;
    const targetRange = market.ranges?.find(
      (r) => r.min === rangeMin && r.max === rangeMax
    );

    if (!targetRange) return 0;

    const totalPool = market.totalLiquidity + amount;
    const rangePool = targetRange.pool + amount;
    
    // Calculate potential payout for this range
    return (amount / rangePool) * totalPool;
  }
};

export const calculateMarketPercentages = (market: IMarket) => {
  if (market.type === MarketType.BINARY) {
    const total = market.yesPool + market.noPool;
    if (total === 0) return { yes: 0, no: 0 };
    
    return {
      yes: (market.yesPool / total) * 100,
      no: (market.noPool / total) * 100
    };
  } else {
    const total = market.totalLiquidity;
    if (total === 0 || !market.ranges) return [];
    
    return market.ranges.map(range => ({
      min: range.min,
      max: range.max,
      percentage: (range.pool / total) * 100
    }));
  }
};