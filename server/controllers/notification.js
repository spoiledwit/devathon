import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });

        res.status(200).json({ notifications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const readNotifications = async (req, res) => {
    try {
        const notifications = await Notification.updateMany(
            { userId: req.userId },
            { read: true }
        );

        res.status(200).json({ notifications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}