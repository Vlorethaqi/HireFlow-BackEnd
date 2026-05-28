import express from "express";
import { Department } from "../models/index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const departments = await Department.findAll({
      where: { companyId: req.user.companyId },
      order: [["name", "ASC"]],
    });

    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const department = await Department.create({
      ...req.body,
      companyId: req.user.companyId,
    });

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
