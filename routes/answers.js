import express from "express";
import { postAnswer, acceptAnswer } from "../controllers/answercontroller.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

// 📝 Post an answer to a question
router.post("/:questionId", verifyToken, postAnswer);

// ✅ Mark answer as accepted
router.patch("/accept/:answerId", verifyToken, acceptAnswer);

export default router;
