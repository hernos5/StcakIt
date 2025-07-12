import Question from "../models/question.js";
import Answer from "../models/answer.js";

// ✅ Create a new question
export const createQuestion = async (req, res) => {
  try {
    const { title, content, tags } = req.body; // 👈 changed 'description' to 'content'

    const newQuestion = new Question({
      title,
      content, // 👈 use content here
      tags,
      user: req.userId,
    });

    const saved = await newQuestion.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to create question", error: err.message });
  }
};

// ✅ Get all questions (optionally filtered by tag)
export const getAllQuestions = async (req, res) => {
  try {
    const tag = req.query.tag;
    let filter = {};
    if (tag) filter.tags = tag;

    const questions = await Question.find(filter)
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "Failed to get questions" });
  }
};

// ✅ Get a single question by ID + its answers
export const getSingleQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("user", "name");
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answers = await Answer.find({ question: req.params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ question, answers });
  } catch (err) {
    res.status(500).json({ message: "Error getting question" });
  }
};
