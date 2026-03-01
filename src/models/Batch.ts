import mongoose, { Schema, Document } from "mongoose";

export interface IBatch extends Document {
  batchNumber: number;
  beerId: string;
  beerName: string;
  beerColor: string;
  totalBottles: number;
  bottlesRemaining: number;
  pricePerBottle: number;
  earlyAccessFee: number;
  status: "announced" | "early_access" | "live" | "sold_out" | "completed";
  announcedAt: Date;
  earlyAccessOpensAt: Date;
  liveSaleOpensAt: Date;
  saleEndsAt: Date;
  description: string;
  isVotingBatch: boolean;
}

const BatchSchema = new Schema<IBatch>(
  {
    batchNumber: { type: Number, required: true, unique: true },
    beerId: { type: String, required: true },
    beerName: { type: String, required: true },
    beerColor: { type: String, required: true },
    totalBottles: { type: Number, required: true },
    bottlesRemaining: { type: Number, required: true },
    pricePerBottle: { type: Number, required: true },
    earlyAccessFee: { type: Number, default: 20 },
    status: {
      type: String,
      enum: ["announced", "early_access", "live", "sold_out", "completed"],
      default: "announced",
    },
    announcedAt: { type: Date, required: true },
    earlyAccessOpensAt: { type: Date, required: true },
    liveSaleOpensAt: { type: Date, required: true },
    saleEndsAt: { type: Date, required: true },
    description: { type: String, default: "" },
    isVotingBatch: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Batch ||
  mongoose.model<IBatch>("Batch", BatchSchema);
