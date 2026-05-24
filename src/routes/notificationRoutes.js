import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.json({ message: "Notification created", notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.params.userId }
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;