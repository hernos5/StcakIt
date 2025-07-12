import express from "express";
import { createQuestion, getAllQuestions, getSingleQuestion } from "../controllers/questioncontroller.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getSingleQuestion);

export default router;
