// utils/seed.ts

import mongoose from 'mongoose';
import User from '../dao/user';
import Market, { MarketType, MarketStatus } from '../dao/market';
import Bet, { BetPosition, BetStatus } from '../dao/bet';
import Transaction, { TransactionType } from '../dao/transaction';
import { createUser } from '../services/userService';
import { createMarket, resolveMarket } from '../services/marketService';
import { placeBet, resolveBets } from '../services/betService';
import { createTransaction } from '../services/transactionService';

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Market.deleteMany({});
    await Bet.deleteMany({});
    await Transaction.deleteMany({});
    
    console.log('Database cleared');
    
    // Create users
    const user1 = await createUser('0x1111111111111111111111111111111111111111');
    const user2 = await createUser('0x2222222222222222222222222222222222222222');
    const user3 = await createUser('0x3333333333333333333333333333333333333333');
    
    console.log('Users created');
    
    // Create a binary market
    const binaryMarket = await createMarket({
      title: 'Will ETH flip BTC by market cap in 2025?',
      description: 'Market resolves YES if Ethereum\'s market cap exceeds Bitcoin\'s at any point in 2025.',
      creator: user1.address,
      type: MarketType.BINARY,
      startTime: new Date(),
      endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });
    
    // Create a range market
    const rangeMarket = await createMarket({
      title: 'ETH price at end of Q1 2025',
      description: 'Market resolves to the ETH price in USD on March 31, 2025.',
      creator: user2.address,
      type: MarketType.RANGE,
      minRange: 2000,
      maxRange: 7000,
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    });
    
    console.log('Markets created');
    
    // Create transactions for market creation
    await createTransaction(
      user1.address,
      TransactionType.MARKET_CREATION,
      0,
      'tx-create-1',
      binaryMarket._id.toString()
    );
    
    await createTransaction(
      user2.address,
      TransactionType.MARKET_CREATION,
      0,
      'tx-create-2',
      rangeMarket._id.toString()
    );
    
    // Place bets on binary market
    const bet1 = await placeBet({
      market: binaryMarket._id.toString(),
      user: user1.address,
      position: BetPosition.YES,
      amount: 100,
    });
    
    const bet2 = await placeBet({
      market: binaryMarket._id.toString(),
      user: user2.address,
      position: BetPosition.NO,
      amount: 150,
    });
    
    const bet3 = await placeBet({
      market: binaryMarket._id.toString(),
      user: user3.address,
      position: BetPosition.YES,
      amount: 200,
    });
    
    // Place bets on range market
    const bet4 = await placeBet({
      market: rangeMarket._id.toString(),
      user: user1.address,
      position: BetPosition.RANGE,
      amount: 300,
      rangeMin: 3000,
      rangeMax: 4000,
    });
    
    const bet5 = await placeBet({
      market: rangeMarket._id.toString(),
      user: user2.address,
      position: BetPosition.RANGE,
      amount: 250,
      rangeMin: 4000,
      rangeMax: 5000,
    });
    
    const bet6 = await placeBet({
      market: rangeMarket._id.toString(),
      user: user3.address,
      position: BetPosition.RANGE,
      amount: 350,
      rangeMin: 3000,
      rangeMax: 4000,
    });
    
    console.log('Bets placed');
    
    // Create transactions for bets
    await createTransaction(
      user1.address,
      TransactionType.PLACE_BET,
      100,
      'tx-bet-1',
      binaryMarket._id.toString(),
      bet1._id.toString()
    );
    
    await createTransaction(
      user2.address,
      TransactionType.PLACE_BET,
      150,
      'tx-bet-2',
      binaryMarket._id.toString(),
      bet2._id.toString()
    );
    
    await createTransaction(
      user3.address,
      TransactionType.PLACE_BET,
      200,
      'tx-bet-3',
      binaryMarket._id.toString(),
      bet3._id.toString()
    );
    
    await createTransaction(
      user1.address,
      TransactionType.PLACE_BET,
      300,
      'tx-bet-4',
      rangeMarket._id.toString(),
      bet4._id.toString()
    );
    
    await createTransaction(
      user2.address,
      TransactionType.PLACE_BET,
      250,
      'tx-bet-5',
      rangeMarket._id.toString(),
      bet5._id.toString()
    );
    
    await createTransaction(
      user3.address,
      TransactionType.PLACE_BET,
      350,
      'tx-bet-6',
      rangeMarket._id.toString(),
      bet6._id.toString()
    );
    
    // Resolve the binary market
    await resolveMarket(
      binaryMarket._id.toString(),
      user1.address,
      'yes'
    );
    
    // Resolve bets for binary market
    await resolveBets(binaryMarket._id.toString(), 'yes');
    
    console.log('Markets resolved');
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
};

export default seedDatabase;