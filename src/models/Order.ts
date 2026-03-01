import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: string;
  batchId: mongoose.Types.ObjectId;
  batchNumber: number;
  beerName: string;
  quantity: number;
  totalAmount: number;
  tierAtPurchase: "consumer" | "early_buyer" | "founder" | "admin";
  status: "pending" | "confirmed" | "collected" | "cancelled";
  deliveryMethod: "pickup" | "delivery";
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true, index: true },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    batchNumber: { type: Number, required: true },
    beerName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true },
    tierAtPurchase: {
      type: String,
      enum: ["consumer", "early_buyer", "founder", "admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "collected", "cancelled"],
      default: "pending",
    },
    deliveryMethod: {
      type: String,
      enum: ["pickup", "delivery"],
      default: "pickup",
    },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1, batchId: 1 });

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
