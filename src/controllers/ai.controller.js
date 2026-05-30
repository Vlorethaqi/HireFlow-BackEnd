import { analyzeApplication } from "../services/ai.service.js";
import { enqueueBackgroundJob, getBackgroundJob } from "../services/backgroundJob.service.js";

export async function analyzeApplicationController(req, res, next) {
  try {
    const applicationId = req.params.applicationId;
    const companyId = req.user.companyId;

    const job = enqueueBackgroundJob("AI_APPLICATION_ANALYSIS", () =>
      analyzeApplication(applicationId, companyId)
    );

    res.status(202).json({
      success: true,
      message: "AI analysis started in the background.",
      data: job,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAiJobController(req, res) {
  const job = getBackgroundJob(req.params.jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Background job not found",
    });
  }

  res.json({
    success: true,
    data: job,
  });
}
