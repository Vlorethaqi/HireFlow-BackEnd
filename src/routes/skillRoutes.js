import express from "express";
import { Skill } from "../models/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const skills = await Skill.findAll({ order: [["name", "ASC"]] });
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
