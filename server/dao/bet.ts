// models/Bet.ts
import mongoose, { Schema, Document } from 'mongoose';
import { MarketType } from './market';


export enum BetStatus {
  ACTIVE = 'active',
  WON = 'won',
  LOST = 'lost',
  CANCELLED = 'cancelled',
}

export enum BetPosition {
  YES = 'yes',
  NO = 'no',
  RANGE = 'range-based',
}

export interface IBet extends Document {
    _id: Schema.Types.ObjectId;
  market: string; // Market ID
  user: string; // User address
  position: BetPosition;
  amount: number;
  rangeMin?: number; // For range markets
  rangeMax?: number; // For range markets
  createdAt: Date;
  status: BetStatus;
  potentialPayout?: number;
  actualPayout?: number;
  resolvedAt?: Date;
}

const BetSchema: Schema = new Schema(
  {
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    user: { type: String, required: true, ref: 'User' },
    position: {
      type: String,
      enum: Object.values(BetPosition),
      required: true,
    },
    amount: { type: Number, required: true },
    rangeMin: { type: Number },
    rangeMax: { type: Number },
    status: {
      type: String,
      enum: Object.values(BetStatus),
      default: BetStatus.ACTIVE,
    },
    potentialPayout: { type: Number },
    actualPayout: { type: Number },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IBet>('Bet', BetSchema);