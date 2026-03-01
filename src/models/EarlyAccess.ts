import mongoose, { Schema, Document } from "mongoose";

export interface IEarlyAccess extends Document {
  userId: string;
  batchId: mongoose.Types.ObjectId;
  feePaid: number;
}

const EarlyAccessSchema = new Schema<IEarlyAccess>(
  {
    userId: { type: String, required: true },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    feePaid: { type: Number, required: true },
  },
  { timestamps: true }
);

EarlyAccessSchema.index({ userId: 1, batchId: 1 }, { unique: true });

export default mongoose.models.EarlyAccess ||
  mongoose.model<IEarlyAccess>("EarlyAccess", EarlyAccessSchema);
