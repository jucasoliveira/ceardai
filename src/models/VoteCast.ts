import mongoose, { Schema, Document } from "mongoose";

export interface IVoteCast extends Document {
  voteId: mongoose.Types.ObjectId;
  userId: string;
  optionId: string;
}

const VoteCastSchema = new Schema<IVoteCast>(
  {
    voteId: { type: Schema.Types.ObjectId, ref: "Vote", required: true },
    userId: { type: String, required: true },
    optionId: { type: String, required: true },
  },
  { timestamps: true }
);

VoteCastSchema.index({ voteId: 1, userId: 1 }, { unique: true });

export default mongoose.models.VoteCast ||
  mongoose.model<IVoteCast>("VoteCast", VoteCastSchema);
