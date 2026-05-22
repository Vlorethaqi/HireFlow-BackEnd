import Application from '../models/Application.js';
import CandidateProfile from '../models/CandidateProfile.js';
import ApplicationStatus from '../models/ApplicationStatus.js';

// Krijimi i aplikimit të ri
export const applyToJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId, companyId, coverLetter } = req.body;

        // Kontrollo nëse kandidati ka krijuar profil
        const profile = await CandidateProfile.findOne({ where: { userId } });
        if (!profile) {
            return res.status(400).json({
                success: false,
                message: "Duhet të plotësoni profilin tuaj para se të aplikoni."
            });
        }

        // Kontrollo nëse ka aplikuar më parë për këtë punë
        const alreadyApplied = await Application.findOne({
            where: { candidateProfileId: profile.id, jobId }
        });
        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: "Ju keni aplikuar një herë në këtë pozitë pune."
            });
        }

        // Krijimi i aplikimit të ri në sistemin Multi-Tenant
        const newApplication = await Application.create({
            candidateProfileId: profile.id,
            jobId,
            companyId,
            coverLetter,
            statusId: 1 // Sugjerim: Mund t'i vendosni një status fillestar default (p.sh. 1 = "Applied")
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

// Marrja e aplikimeve të mia (Për kandidatin)
export const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await CandidateProfile.findOne({ where: { userId } });
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profili nuk u gjet." });
        }

        const applications = await Application.findAll({
            where: { candidateProfileId: profile.id },
            include: [{ model: ApplicationStatus, attributes: ['name'] }]
        });

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Marrja e aplikimeve të kompanisë (Për HR / Menaxherin)
export const getCompanyApplications = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const applications = await Application.findAll({
            where: { companyId },
            include: [
                { model: ApplicationStatus, attributes: ['name'] }
            ]
        });

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Përditësimi i statusit (Nga HR - p.sh. "Intervistohet", "Pranohet", "Refuzohet")
export const updateStatus = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;
        const { statusId } = req.body;

        // Sigurohet izolimi Multi-Tenant (vetëm kompania e vet mund ta përditësojë)
        const application = await Application.findOne({ where: { id, companyId } });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Aplikimi nuk ekziston ose nuk keni autorizim për këtë kompani."
            });
        }

        application.statusId = statusId;
        await application.save();

        res.status(200).json({
            success: true,
            message: "Statusi i aplikimit u përditësua me sukses!",
            data: application
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
