import express from "express";
import { Application, ApplicationResponse, AuditLog, Notification } from "../models/index.js";
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

    const response = await ApplicationResponse.create({
      ...req.body,
      senderId: req.user.id,
      companyId: req.user.companyId
    });

    await Notification.create({
      userId: application.userId,
      title: "Application response",
      message: req.body.message,
      type: "RESPONSE",
      companyId: req.user.companyId
    });

    await AuditLog.create({
      userId: req.user.id,
      action: "APPLICATION_RESPONSE_CREATED",
      entity: "ApplicationResponse",
      entityId: response.id,
      companyId: req.user.companyId,
      description: `Response sent for application ${application.id}`
    });

    res.status(201).json({ success: true, message: "Application response created", data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", authorizePermission("applications:review"), async (req, res) => {
  try {
    const responses = await ApplicationResponse.findAll({ where: { companyId: req.user.companyId } });
    res.json({ success: true, data: responses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/application/:applicationId", async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.applicationId);
    const canView =
      application &&
      (Number(application.userId) === Number(req.user.id) ||
        Number(application.companyId) === Number(req.user.companyId));

    if (!canView) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const responses = await ApplicationResponse.findAll({
      where: { applicationId: req.params.applicationId }
    });

    res.json({ success: true, data: responses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", authorizePermission("applications:review"), async (req, res) => {
  try {
    const response = await ApplicationResponse.findOne({
      where: { id: req.params.id, companyId: req.user.companyId }
    });

    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    await response.update(req.body);
    res.json({ success: true, message: "Response updated", data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", authorizePermission("applications:review"), async (req, res) => {
  try {
    const response = await ApplicationResponse.findOne({
      where: { id: req.params.id, companyId: req.user.companyId }
    });

    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    await response.destroy();
    res.json({ message: "Response deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
