import CandidateSkill from "../models/CandidateSkill.js";

export const createCandidateSkill = async (req, res) => {
  try {
    const candidateSkill = await CandidateSkill.create(req.body);

    res.status(201).json(candidateSkill);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCandidateSkills = async (req, res) => {
  try {
    const candidateSkills = await CandidateSkill.findAll();

    res.json(candidateSkills);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCandidateSkill = async (req, res) => {
  try {
    const candidateSkill = await CandidateSkill.findByPk(req.params.id);

    if (!candidateSkill) {
      return res.status(404).json({
        message: "Candidate skill not found",
      });
    }

    await candidateSkill.destroy();

    res.json({
      message: "Candidate skill deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};