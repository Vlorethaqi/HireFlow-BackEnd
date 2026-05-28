import express from "express";
import * as savedJobController from "../controllers/savedJobController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", savedJobController.saveJob);
router.get("/", savedJobController.getSavedJobs);
router.get("/user/:userId", savedJobController.getSavedJobs);
router.delete("/:id", savedJobController.unsaveJob);

export default router;

