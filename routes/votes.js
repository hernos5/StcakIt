import express from "express";
import { voteAnswer } from "../controllers/votecontroller.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/:answerId", verifyToken, voteAnswer);

export default router;
