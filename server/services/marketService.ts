// services/marketService.ts
import Market, { IMarket, MarketType, MarketStatus } from "../dao/market";
import { MarketCreateParams, MarketFilters } from "../utils/types";

export const createMarket = async (
  params: MarketCreateParams
): Promise<IMarket> => {
  const {
    marketName,
    question,
    creator,
    type,
    minRange,
    maxRange,
    startTime,
    endTime,
    link,
    media,
    metric,
  } = params;

  let _type;
  if(type==0){
    _type=MarketType.BINARY;
  }else{
    _type=MarketType.RANGE;
  }

  console.log(minRange,maxRange,_type);

  let marketData: any = {
    marketName,
    question,
    creator,
    type:_type,
    startTime,
    endTime,
    link,
    media,
    metric,
    status: new Date() > startTime ? MarketStatus.ACTIVE : MarketStatus.PENDING,
  };

  if (_type === MarketType.RANGE) {
    if (!minRange || !maxRange) {
      throw new Error("Range markets require min and max range values");
    }

    marketData.minRange = minRange;
    marketData.maxRange = maxRange;

    // Create predefined ranges (e.g., divide into 10 segments)
    const rangeSize = (maxRange - minRange) / 10;
    const ranges = [];

    for (let i = 0; i < 10; i++) {
      const min = minRange + rangeSize * i;
      const max = min + rangeSize;
      ranges.push({ min, max, pool: 0 });
    }

    marketData.ranges = ranges;
  }
  console.log(marketData,"marketData")

  const market = new Market(marketData);
  return await market.save();
};

export const getAllMarkets = async (
  filters: MarketFilters = {}
): Promise<IMarket[]> => {
  const query: any = {};

  if (filters.status) query.status = filters.status;
  if (filters.creator) query.creator = filters.creator;
  if (filters.type) query.type = filters.type;

  return await Market.find(query).sort({ createdAt: -1 });
};

export const getMarketById = async (id: string): Promise<IMarket | null> => {
  return await Market.findById(id);
};

export const updateMarket = async (
  id: string,
  updates: Partial<IMarket>
): Promise<IMarket | null> => {
  return await Market.findByIdAndUpdate(id, updates, { new: true });
};

export const resolveMarket = async (
  id: string,
  resolverAddress: string,
  outcome: string,
  outcomeValue?: number
): Promise<IMarket | null> => {
  const market = await Market.findById(id);

  if (!market) throw new Error("Market not found");
  if (market.status === MarketStatus.RESOLVED)
    throw new Error("Market already resolved");
  if (new Date() < market.endTime)
    throw new Error("Cannot resolve market before end time");

  market.status = MarketStatus.RESOLVED;
  market.outcome = outcome;
  market.resolvedBy = resolverAddress;
  market.resolvedAt = new Date();

  if (market.type === MarketType.RANGE && outcomeValue !== undefined) {
    market.outcomeValue = outcomeValue;
  }

  return await market.save();
};
