import express from "express";
import { CandidateSkill, JobSkill, Skill } from "../models/index.js";
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

router.post("/", authMiddleware, async (req, res) => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({ success: false, message: "Skill name is required" });
    }

    const [skill, created] = await Skill.findOrCreate({
      where: { name },
      defaults: {
        name,
        category: req.body.category || "TECHNICAL",
        description: req.body.description?.trim() || null,
      },
    });

    res.status(created ? 201 : 200).json({ success: true, data: skill });
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

    await Promise.all([
      JobSkill.destroy({ where: { skillId: skill.id } }),
      CandidateSkill.destroy({ where: { skillId: skill.id } }),
    ]);

    await skill.destroy();
    res.json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Skill could not be deleted.",
      error: error.message,
    });
  }
});

export default router;
