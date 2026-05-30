import Application from '../models/Application.js';
import CandidateProfile from '../models/CandidateProfile.js';
import ApplicationStatus from '../models/ApplicationStatus.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import ApplicationDocument from '../models/ApplicationDocument.js';
import fs from "fs/promises";
import path from "path";

const uploadDirectory = path.resolve("src", "public", "uploads", "application-documents");

function sanitizeFileName(fileName = "cover-letter.txt") {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function saveCoverLetterFile(application, coverLetterFile) {
    if (!coverLetterFile?.contentBase64 || !coverLetterFile?.fileName) {
        return null;
    }

    await fs.mkdir(uploadDirectory, { recursive: true });

    const safeName = sanitizeFileName(coverLetterFile.fileName);
    const storedName = `${application.id}-${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDirectory, storedName);
    const fileBuffer = Buffer.from(coverLetterFile.contentBase64, "base64");

    await fs.writeFile(filePath, fileBuffer);

    return ApplicationDocument.create({
        applicationId: application.id,
        documentType: "COVER_LETTER",
        fileName: safeName,
        fileUrl: `/uploads/application-documents/${storedName}`,
        companyId: application.companyId,
    });
}

export const applyToJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId, coverLetter, coverLetterFile } = req.body;

        if (req.user.role !== "CANDIDATE") {
            return res.status(403).json({
                success: false,
                message: "Vetem kandidatet mund te aplikojne per pune."
            });
        }

        const profile = await CandidateProfile.findOne({ where: { userId } });
        if (!profile) {
            return res.status(400).json({
                success: false,
                message: "Duhet të plotësoni profilin tuaj para se të aplikoni."
            });
        }

        const requiredProfileFields = ["phone", "location", "education", "cvUrl"];
        const hasMissingProfileData = requiredProfileFields.some((field) => !profile[field]);

        if (hasMissingProfileData) {
            return res.status(400).json({
                success: false,
                message: "Duhet të plotësoni profilin dhe të ngarkoni CV-në para se të aplikoni."
            });
        }

        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Pozita e punes nuk u gjet."
            });
        }

        const alreadyApplied = await Application.findOne({
            where: { candidateProfileId: profile.id, jobId }
        });
        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: "Ju keni aplikuar një herë në këtë pozitë pune."
            });
        }

        const pendingStatus = await ApplicationStatus.findOne({ where: { name: "PENDING" } });

        
        const newApplication = await Application.create({
            userId,
            candidateProfileId: profile.id,
            jobId,
            companyId: job.companyId,
            coverLetter,
            statusId: pendingStatus?.id || 1 
        });

        await saveCoverLetterFile(newApplication, coverLetterFile);

        await AuditLog.create({
            userId,
            action: "APPLICATION_CREATED",
            entity: "Application",
            entityId: newApplication.id,
            companyId: job.companyId,
            description: `Candidate applied for job ${job.title}`
        });

        res.status(201).json({
            success: true,
            message: "Aplikimi u realizua me sukses!",
            data: newApplication
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await CandidateProfile.findOne({ where: { userId } });
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profili nuk u gjet." });
        }

        const applications = await Application.findAll({
            where: { candidateProfileId: profile.id },
            include: [
                { model: ApplicationStatus, attributes: ['name'] },
                { model: Job, attributes: ['id', 'title', 'location', 'employmentType'] }
            ]
        });

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const getCompanyApplications = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const applications = await Application.findAll({
            where: { companyId },
            include: [
                { model: ApplicationStatus, attributes: ['name'] },
                { model: Job, attributes: ['id', 'title'] },
                { model: CandidateProfile }
            ]
        });

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const updateStatus = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;
        const { statusId, statusName } = req.body;

        const application = await Application.findOne({ where: { id, companyId } });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Aplikimi nuk ekziston ose nuk keni autorizim për këtë kompani."
            });
        }

        let nextStatusId = statusId;

        if (!nextStatusId && statusName) {
            const status = await ApplicationStatus.findOne({ where: { name: statusName } });
            nextStatusId = status?.id;
        }

        const nextStatus = await ApplicationStatus.findByPk(nextStatusId);

        if (!nextStatus) {
            return res.status(400).json({
                success: false,
                message: "Statusi i zgjedhur nuk ekziston."
            });
        }

        application.statusId = nextStatus.id;
        await application.save();

        await Notification.create({
            userId: application.userId,
            title: "Application status updated",
            message: "Statusi i aplikimit tuaj eshte perditesuar.",
            type: "APPLICATION",
            companyId
        });

        await AuditLog.create({
            userId: req.user.id,
            action: "APPLICATION_STATUS_UPDATED",
            entity: "Application",
            entityId: application.id,
            companyId,
            description: `Application status changed to ${nextStatus.name}`
        });

        res.status(200).json({
            success: true,
            message: "Statusi i aplikimit u përditësua me sukses!",
            data: {
                ...application.toJSON(),
                ApplicationStatus: nextStatus
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
