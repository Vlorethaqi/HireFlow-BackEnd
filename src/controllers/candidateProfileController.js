import CandidateProfile from "../models/CandidateProfile.js";
import CandidateSkill from "../models/CandidateSkill.js";
import Skill from "../models/Skill.js";
import User from "../models/User.js";
import fs from "fs/promises";
import path from "path";

const cvUploadDirectory = path.resolve("src", "public", "uploads", "candidate-cvs");

function sanitizeFileName(fileName = "cv.pdf") {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function saveCvFile(userId, cvFile) {
    if (!cvFile?.contentBase64 || !cvFile?.fileName) {
        return null;
    }

    await fs.mkdir(cvUploadDirectory, { recursive: true });

    const safeName = sanitizeFileName(cvFile.fileName);
    const storedName = `${userId}-${Date.now()}-${safeName}`;
    const filePath = path.join(cvUploadDirectory, storedName);
    const fileBuffer = Buffer.from(cvFile.contentBase64, "base64");

    await fs.writeFile(filePath, fileBuffer);

    return `/uploads/candidate-cvs/${storedName}`;
}

export const getAllProfiles = async (req, res) => {
    try {
        const profiles = await CandidateProfile.findAll();

        res.status(200).json(profiles);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const profile = await CandidateProfile.findOne({
            where: { userId: req.user.id },
            include: [
                { model: User, attributes: ["id", "name", "email"] },
                { model: CandidateSkill, include: [{ model: Skill }] }
            ]
        });

        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const upsertMyProfile = async (req, res) => {
    try {
        const { skills = [], cvFile, ...profileData } = req.body;
        const savedCvUrl = await saveCvFile(req.user.id, cvFile);
        if (savedCvUrl) {
            profileData.cvUrl = savedCvUrl;
        } else {
            delete profileData.cvFile;
        }

        const [profile] = await CandidateProfile.findOrCreate({
            where: { userId: req.user.id },
            defaults: {
                ...profileData,
                phone: profileData.phone || "",
                userId: req.user.id
            }
        });

        if (!profile.isNewRecord) {
            await profile.update({
                ...profileData,
                userId: req.user.id
            });
        }

        if (Array.isArray(skills)) {
            await CandidateSkill.destroy({ where: { candidateProfileId: profile.id } });

            const candidateSkills = skills
                .filter((item) => item)
                .map((item) => ({
                    candidateProfileId: profile.id,
                    skillId: typeof item === "object" ? item.skillId : item
                }));

            if (candidateSkills.length) {
                await CandidateSkill.bulkCreate(candidateSkills);
            }
        }

        const updatedProfile = await CandidateProfile.findByPk(profile.id, {
            include: [
                { model: User, attributes: ["id", "name", "email"] },
                { model: CandidateSkill, include: [{ model: Skill }] }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Profile saved successfully",
            data: updatedProfile
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export const getProfileById = async (req, res) => {
    try {

        const profile = await CandidateProfile.findByPk(req.params.id);

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found",
            });
        }

        res.status(200).json(profile);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};



export const createProfile = async (req, res) => {
    try {

        const profile = await CandidateProfile.create(req.body);

        res.status(201).json(profile);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};



export const updateProfile = async (req, res) => {
    try {

        const profile = await CandidateProfile.findByPk(req.params.id);

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found",
            });
        }

        await profile.update(req.body);

        res.status(200).json(profile);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};


export const deleteProfile = async (req, res) => {
    try {

        const profile = await CandidateProfile.findByPk(req.params.id);

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found",
            });
        }

        await profile.destroy();

        res.status(200).json({
            message: "Profile deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};
