// services/transactionService.ts
import Transaction, { ITransaction, TransactionType } from '../dao/transaction';

export const createTransaction = async (
  userAddress: string,
  type: TransactionType,
  amount: number,
  txHash: string,
  marketId?: string,
  betId?: string
): Promise<ITransaction> => {
  const transaction = new Transaction({
    user: userAddress,
    type,
    amount,
    txHash,
    market: marketId,
    bet: betId,
  });
  
  return await transaction.save();
};

export const getUserTransactions = async (userAddress: string): Promise<ITransaction[]> => {
  return await Transaction.find({ user: userAddress })
    .populate('market')
    .populate('bet')
    .sort({ createdAt: -1 });
};
