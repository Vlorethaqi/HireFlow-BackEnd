import { Job, JobSkill, SavedJob, Skill } from "../models/index.js";

export const saveJob = async (req, res) => {
  try {
    if (req.user.role !== "CANDIDATE") {
      return res.status(403).json({
        success: false,
        message: "Vetem kandidatet mund te ruajne pune.",
      });
    }

    const userId = req.user.id;
    const { jobId } = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Puna nuk u gjet.",
      });
    }

    const alreadySaved = await SavedJob.findOne({ where: { userId, jobId } });
    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Kjo pozite pune eshte ruajtur tashme.",
      });
    }

    const savedJob = await SavedJob.create({ userId, jobId });
    res.status(201).json({ success: true, data: savedJob });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Job,
          include: [
            {
              model: Skill,
              through: { model: JobSkill, attributes: ["importanceLevel"] },
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const savedJob = await SavedJob.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Puna e ruajtur nuk u gjet.",
      });
    }

    await savedJob.destroy();
    res.status(200).json({
      success: true,
      message: "Puna u hoq nga te ruajturat me sukses.",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
