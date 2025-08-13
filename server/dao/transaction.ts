// models/Transaction.ts
import mongoose, { Schema, Document } from 'mongoose';

export enum TransactionType {
  MARKET_CREATION = 'market_creation',
  PLACE_BET = 'place_bet',
  RESOLVE_MARKET = 'resolve_market',
  CLAIM_WINNINGS = 'claim_winnings',
}

export interface ITransaction extends Document {
    _id: Schema.Types.ObjectId;
  user: string; // User address
  market?: string; // Market ID (optional)
  bet?: string; // Bet ID (optional)
  type: TransactionType;
  amount: number;
  txHash: string; // Blockchain transaction hash
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    user: { type: String, required: true, ref: 'User' },
    market: { type: Schema.Types.ObjectId, ref: 'Market' },
    bet: { type: Schema.Types.ObjectId, ref: 'Bet' },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: { type: Number, required: true },
    txHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);