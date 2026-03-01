import mongoose, { Schema, Document } from "mongoose";

export interface IFounder extends Document {
  userId: string;
  name: string;
  spotNumber: number;
  allocationPerBatch: number;
  isActive: boolean;
}

const FounderSchema = new Schema<IFounder>(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    spotNumber: { type: Number, required: true, min: 1, max: 14, unique: true },
    allocationPerBatch: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Founder ||
  mongoose.model<IFounder>("Founder", FounderSchema);
