import express from "express";
import { Skill } from "../models/index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const skills = await Skill.findAll({ order: [["name", "ASC"]] });
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/", authMiddleware, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    await skill.destroy();
    res.json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    res.status(409).json({
      success: false,
      message: "Skill could not be deleted. Remove it from jobs or profiles first.",
      error: error.message,
    });
  }
});

export default router;
