import express from "express";
import { analyzeApplicationController } from "../controllers/ai.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/permissionMiddleware.js";

const router = express.Router();

router.post(
  "/analyze-application/:applicationId",
  authMiddleware,
  authorizePermission("applications:review"),
  analyzeApplicationController
);

export default router;
