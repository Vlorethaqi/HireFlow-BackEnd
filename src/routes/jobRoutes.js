import express from "express";
import { getAllJobs, createJob } from "../controllers/jobController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/permissionMiddleware.js";

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", authMiddleware, authorizePermission("jobs:manage"), createJob);

export default router;
