import express from "express";
import {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile
} from "../controllers/candidateProfileController.js";

const router = express.Router();

router.get("/", getAllProfiles);
router.get("/:id", getProfileById);
router.post("/", createProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

export default router;