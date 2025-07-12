// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import authRoutes from "./routes/auths.js"; // ✅ Fixed: was 'auth.js'
import questionRoutes from "./routes/qusetions.js";
import answerRoutes from "./routes/answers.js";
import voteRoutes from "./routes/votes.js";
import notificationRoutes from "./routes/notifications.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ✅ API Routes
app.use("/api/auths", authRoutes);           // ✅ Fixed: was '/api/auth'
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/notifications", notificationRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(5000, () => console.log("Server running on port 5000 🚀"));
  })
  .catch((err) => console.log("MongoDB Error ❌", err));
