import express from "express";
import AuditLog from "../models/AuditLog.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const log = await AuditLog.create(req.body);
    res.json({ message: "Audit log created", log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const logs = await AuditLog.findAll();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/company/:companyId", async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      where: { companyId: req.params.companyId }
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      where: { userId: req.params.userId }
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;