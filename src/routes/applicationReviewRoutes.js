import express from "express";
import { Application, ApplicationReview, AuditLog } from "../models/index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/permissionMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", authorizePermission("applications:review"), async (req, res) => {
  try {
    const application = await Application.findOne({
      where: { id: req.body.applicationId, companyId: req.user.companyId }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const review = await ApplicationReview.create({
      ...req.body,
      reviewerId: req.user.id,
      companyId: req.user.companyId
    });

    await AuditLog.create({
      userId: req.user.id,
      action: "APPLICATION_REVIEW_CREATED",
      entity: "ApplicationReview",
      entityId: review.id,
      companyId: req.user.companyId,
      description: `Review created for application ${application.id}`
    });

    res.status(201).json({ success: true, message: "Application review created", data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", authorizePermission("applications:review"), async (req, res) => {
  try {
    const reviews = await ApplicationReview.findAll({ where: { companyId: req.user.companyId } });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/application/:applicationId", authorizePermission("applications:review"), async (req, res) => {
  try {
    const reviews = await ApplicationReview.findAll({
      where: { applicationId: req.params.applicationId, companyId: req.user.companyId }
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", authorizePermission("applications:review"), async (req, res) => {
  try {
    const review = await ApplicationReview.findOne({
      where: { id: req.params.id, companyId: req.user.companyId }
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.update(req.body);
    res.json({ success: true, message: "Review updated", data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", authorizePermission("applications:review"), async (req, res) => {
  try {
    const review = await ApplicationReview.findOne({
      where: { id: req.params.id, companyId: req.user.companyId }
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.destroy();
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
