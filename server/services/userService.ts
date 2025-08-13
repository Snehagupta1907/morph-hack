// services/userService.ts (enhanced)
import User, { IUser } from "../dao/user";
import Bet, { BetStatus } from "../dao/bet";
import Market from "../dao/market";
import { LeaderboardEntry } from "../utils/types";

export const createUser = async (address: string): Promise<IUser> => {
  const existingUser = await User.findOne({ address });
  if (existingUser) return existingUser;

  const user = new User({ address });
  return await user.save();
};

export const _checkUserFaucetClaimed = async (
  address: string
): Promise<boolean> => {
  try {
    const existingUser = await User.findOne({ address });
    return existingUser ? existingUser.isFaucetClaimed : false;
  } catch (error) {
    console.error("Error checking faucet claim:", error);
    return false;
  }
};
export const getUserByAddress = async (
  address: string
): Promise<IUser | null> => {
  return await User.findOne({ address });
};

export const getOrCreateUser = async (address: string): Promise<IUser> => {
  const user = await getUserByAddress(address);
  if (user) return user;
  return await createUser(address);
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find().sort({ createdAt: -1 });
};

export const getLeaderboard = async (
  limit = 10
): Promise<LeaderboardEntry[]> => {
  // Use aggregation pipeline for more efficient leaderboard calculation
  const betsGrouped = await Bet.aggregate([
    {
      $group: {
        _id: "$user",
        totalBets: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        wonBets: {
          $sum: {
            $cond: [{ $eq: ["$status", BetStatus.WON] }, 1, 0],
          },
        },
        totalWinnings: {
          $sum: {
            $cond: [
              { $eq: ["$status", BetStatus.WON] },
              { $ifNull: ["$actualPayout", 0] },
              0,
            ],
          },
        },
      },
    },
    { $sort: { totalWinnings: -1 } },
    { $limit: limit },
  ]);

  // Transform the aggregation results to match our expected format
  const leaderboard = betsGrouped.map((item) => ({
    user: item._id,
    totalBets: item.totalBets,
    wonBets: item.wonBets,
    winRate: item.totalBets > 0 ? (item.wonBets / item.totalBets) * 100 : 0,
    totalProfit: item.totalWinnings - item.totalAmount,
  }));

  return leaderboard;
};

export const getUserActivity = async (address: string): Promise<any> => {
  // Get a summary of user's activity
  const user = await getUserByAddress(address);
  if (!user) return null;

  const betsCount = await Bet.countDocuments({ user: address });
  const marketsCreatedCount = await Market.countDocuments({ creator: address });
  const wonBetsCount = await Bet.countDocuments({
    user: address,
    status: BetStatus.WON,
  });

  // Get recent activity
  const recentBets = await Bet.find({ user: address })
    .populate("market")
    .sort({ createdAt: -1 })
    .limit(5);

  const recentMarkets = await Market.find({ creator: address })
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    userAddress: address,
    joinedAt: user.createdAt,
    stats: {
      betsCount,
      marketsCreatedCount,
      wonBetsCount,
      winRate: betsCount > 0 ? (wonBetsCount / betsCount) * 100 : 0,
    },
    recentActivity: {
      bets: recentBets,
      createdMarkets: recentMarkets,
    },
  };
};
