import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🔐 Auth Header:", authHeader); // Debug log

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("⛔ No token found in header.");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded); // Debug log
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("❌ Invalid token error:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};
