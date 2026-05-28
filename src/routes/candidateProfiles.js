import express from "express";
import {
    getAllProfiles,
    getMyProfile,
    upsertMyProfile,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile
} from "../controllers/candidateProfileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProfiles);
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, upsertMyProfile);
router.get("/:id", getProfileById);
router.post("/", createProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

export default router;