import mongoose, { Schema, Document } from "mongoose";

export interface IFounder extends Document {
  userId: string;
  name: string;
  email: string;
  spotNumber: number;
  allocationPerBatch: number;
  isActive: boolean;
  inviteToken: string;
  inviteStatus: "pending" | "sent" | "accepted";
  invitedBy: string | null;
  hasUsedInvite: boolean;
}

const FounderSchema = new Schema<IFounder>(
  {
    userId: { type: String, default: "", unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    spotNumber: { type: Number, required: true, min: 1, max: 14, unique: true },
    allocationPerBatch: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
    inviteToken: { type: String, unique: true, sparse: true },
    inviteStatus: {
      type: String,
      enum: ["pending", "sent", "accepted"],
      default: "pending",
    },
    invitedBy: { type: String, default: null },
    hasUsedInvite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Founder ||
  mongoose.model<IFounder>("Founder", FounderSchema);
