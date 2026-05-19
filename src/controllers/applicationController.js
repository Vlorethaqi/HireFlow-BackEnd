const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');
const ApplicationStatus = require('../models/ApplicationStatus');


exports.applyToJob = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { jobId, companyId, coverLetter } = req.body; 

      
        const profile = await CandidateProfile.findOne({ where: { userId } });
        if (!profile) {
            return res.status(400).json({ 
                success: false, 
                message: "Duhet të plotësoni profilin tuaj para se të aplikoni." 
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

        // Krijimi i aplikimit të ri
        const newApplication = await Application.create({
            candidateProfileId: profile.id,
            jobId,
            companyId, // Kyçja në sistemin Multi-Tenant
            coverLetter
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

exports.getMyApplications = async (req, res) => {
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

exports.getCompanyApplications = async (req, res) => {
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


exports.updateStatus = async (req, res) => {
    try {
        const companyId = req.user.companyId; 
        const { id } = req.params; 
        const { statusId } = req.body; 


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