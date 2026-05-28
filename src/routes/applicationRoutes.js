import express from "express";
import {
  applyToJob,
  getCompanyApplications,
  getMyApplications,
  updateStatus,
} from "../controllers/applicationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/permissionMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyToJob);
router.get("/me", authMiddleware, getMyApplications);
router.get(
  "/company",
  authMiddleware,
  authorizePermission("applications:review"),
  getCompanyApplications
);
router.put(
  "/:id/status",
  authMiddleware,
  authorizePermission("applications:review"),
  updateStatus
);

export default router;
