import { analyzeApplication } from "../services/ai.service.js";

export async function analyzeApplicationController(req, res, next) {
  try {
    const applicationId = req.params.applicationId;
    const companyId = req.user.companyId;

    const analysis = await analyzeApplication(applicationId, companyId);

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
}
