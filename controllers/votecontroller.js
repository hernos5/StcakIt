import Vote from "../models/vote.js";
import Answer from "../models/answer.js";

// Toggle vote (up/down) on answer
export const voteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { voteType } = req.body; // "up" or "down"

    if (!["up", "down"].includes(voteType))
      return res.status(400).json({ message: "Invalid vote type" });

    const existingVote = await Vote.findOne({ answer: answerId, user: req.userId });

    if (existingVote) {
      // If same vote, remove vote (toggle)
      if (existingVote.voteType === voteType) {
        await Vote.deleteOne({ _id: existingVote._id });
        return res.status(200).json({ message: "Vote removed" });
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        await existingVote.save();
        return res.status(200).json({ message: "Vote updated" });
      }
    }

    // New vote
    const vote = new Vote({
      answer: answerId,
      user: req.userId,
      voteType,
    });

    await vote.save();
    res.status(201).json({ message: "Vote added" });
  } catch (err) {
    res.status(500).json({ message: "Vote failed", error: err.message });
  }
};
