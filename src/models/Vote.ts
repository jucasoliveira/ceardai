import mongoose, { Schema, Document } from "mongoose";

export interface IVoteOption {
  id: string;
  label: string;
  description: string;
  votes: number;
}

export interface IVote extends Document {
  title: string;
  options: IVoteOption[];
  status: "open" | "closed" | "tallied";
  opensAt: Date;
  closesAt: Date;
}

const VoteOptionSchema = new Schema<IVoteOption>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String, default: "" },
    votes: { type: Number, default: 0 },
  },
  { _id: false }
);

const VoteSchema = new Schema<IVote>(
  {
    title: { type: String, required: true },
    options: { type: [VoteOptionSchema], required: true },
    status: {
      type: String,
      enum: ["open", "closed", "tallied"],
      default: "open",
    },
    opensAt: { type: Date, required: true },
    closesAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Vote ||
  mongoose.model<IVote>("Vote", VoteSchema);
