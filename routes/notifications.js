import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationcontroller.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.patch("/read", verifyToken, markAsRead);

export default router;
