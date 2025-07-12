import Answer from "../models/answer.js";
import Question from "../models/question.js";

// Post an answer to a question
export const postAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const questionId = req.params.questionId;

    const answer = new Answer({
      content,
      user: req.userId,
      question: questionId,
    });

    const savedAnswer = await answer.save();
    res.status(201).json(savedAnswer);
  } catch (err) {
    res.status(500).json({ message: "Failed to post answer", error: err.message });
  }
};

// Mark an answer as accepted
export const acceptAnswer = async (req, res) => {
  try {
    const answerId = req.params.answerId;

    const answer = await Answer.findById(answerId).populate("question");
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.question.user.toString() !== req.userId)
      return res.status(403).json({ message: "Not authorized to accept this answer" });

    answer.isAccepted = true;
    await answer.save();

    res.status(200).json({ message: "Answer accepted ✅", answer });
  } catch (err) {
    res.status(500).json({ message: "Failed to accept answer", error: err.message });
  }
};
