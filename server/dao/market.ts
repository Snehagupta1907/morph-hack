// models/Market.ts
import mongoose, { Schema, Document, Mongoose } from "mongoose";

export enum MarketType {
  BINARY = "binary",
  RANGE = "range-based",
}

export enum MarketStatus {
  PENDING = "pending",
  ACTIVE = "active",
  RESOLVED = "resolved",
  CANCELLED = "cancelled",
}
export interface IMarket extends Document {
  _id: Schema.Types.ObjectId;
  question: string;
  marketName:string;
  media:string;
  metric:string;
  link:string;
  creator: string; // User address
  type: MarketType;
  // For binary markets
  yesPool: number;
  noPool: number;
  // For range markets
  minRange?: number;
  maxRange?: number;
  ranges?: { min: number; max: number; pool: number }[];
  // Common fields
  totalLiquidity: number;
  startTime: Date;
  endTime: Date;
  status: MarketStatus;
  outcome?: string; // Final outcome (for resolved markets)
  outcomeValue?: number; // Final outcome value (for range markets)
  resolvedBy?: string; // Address of resolver
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MarketSchema: Schema = new Schema(
  {
    marketName:{ type: String, required: true },
    question: { type: String, required: true },
    media: { type: String, required: true },
    metric: { type: String, required: true },
    link: { type: String, required: true },
    creator: { type: String, required: true, ref: "User" },
    type: {
      type: String,
      enum: Object.values(MarketType),
      required: true,
    },
    // Binary market fields
    yesPool: { type: Number, default: 0 },
    noPool: { type: Number, default: 0 },
    // Range market fields
    minRange: { type: Number },
    maxRange: { type: Number },
    ranges: [
      {
        min: { type: Number },
        max: { type: Number },
        pool: { type: Number, default: 0 },
      },
    ],
    // Common fields
    totalLiquidity: { type: Number, default: 0 },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(MarketStatus),
      default: MarketStatus.PENDING,
    },
    outcome: { type: String },
    outcomeValue: { type: Number },
    resolvedBy: { type: String, ref: "User" },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IMarket>("Market", MarketSchema);
