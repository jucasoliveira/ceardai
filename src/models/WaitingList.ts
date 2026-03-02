import mongoose, { Schema, Document } from "mongoose";

export interface IWaitingList extends Document {
  name: string;
  email: string;
  invitedBy: string | null;
  status: "waiting" | "promoted" | "expired";
}

const WaitingListSchema = new Schema<IWaitingList>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    invitedBy: { type: String, default: null },
    status: {
      type: String,
      enum: ["waiting", "promoted", "expired"],
      default: "waiting",
    },
  },
  { timestamps: true }
);

export default mongoose.models.WaitingList ||
  mongoose.model<IWaitingList>("WaitingList", WaitingListSchema);
