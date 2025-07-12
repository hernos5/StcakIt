import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: true },
    voteType: { type: String, enum: ["up", "down"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Vote", voteSchema);
