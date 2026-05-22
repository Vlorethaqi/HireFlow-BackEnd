import express from "express";

import {
  createCandidateSkill,
  getCandidateSkills,
  deleteCandidateSkill,
} from "../controllers/candidateSkillController.js";

const router = express.Router();

router.post("/", createCandidateSkill);

router.get("/", getCandidateSkills);

router.delete("/:id", deleteCandidateSkill);

export default router;