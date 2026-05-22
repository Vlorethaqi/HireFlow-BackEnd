// 🌟 RREGULLIMI: Importohen të dyja si "Named Exports" nga fajlli qendror index.js
import { SavedJob, Job } from '../models/index.js';

// Ruaj një punë (Save Job)
export const saveJob = async (req, res) => {
    try {
        const { userId, jobId } = req.body;

        const alreadySaved = await SavedJob.findOne({ where: { userId, jobId } });
        if (alreadySaved) {
            return res.status(400).json({ success: false, message: "Kjo pozitë pune është ruajtur tashmë." });
        }

        const savedJob = await SavedJob.create({ userId, jobId });
        res.status(201).json({ success: true, data: savedJob });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Merr punët e ruajtura për një përdorues
export const getSavedJobs = async (req, res) => {
    try {
        const { userId } = req.params;
        const savedJobs = await SavedJob.findAll({
            where: { userId }
        });

        res.status(200).json({ success: true, data: savedJobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Hiq punën nga të ruajturat (Unsave)
export const unsaveJob = async (req, res) => {
    try {
        const { id } = req.params;
        const savedJob = await SavedJob.findByPk(id);

        if (!savedJob) {
            return res.status(404).json({ success: false, message: "Puna e ruajtur nuk u gjet." });
        }

        await savedJob.destroy();
        res.status(200).json({ success: true, message: "Puna u hoq nga të ruajturat me sukses." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
