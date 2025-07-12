import Notification from "../models/notification.js";

// Get all notifications for current user
export const getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(notifs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Mark all notifications as read
export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.userId }, { $set: { read: true } });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

// Optional: Create notification (used from other controllers)
export const createNotification = async (userId, message) => {
  try {
    const notif = new Notification({ user: userId, message });
    await notif.save();
  } catch (err) {
    console.error("Notification error:", err.message);
  }
};
