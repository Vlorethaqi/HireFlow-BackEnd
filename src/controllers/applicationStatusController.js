import ApplicationStatus from '../models/ApplicationStatus.js';

export const getAllStatuses = async (req, res) => {
    try {
        const statuses = await ApplicationStatus.findAll();
        res.status(200).json({ success: true, data: statuses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getStatusById = async (req, res) => {
    try {
        const { id } = req.params;
        const status = await ApplicationStatus.findByPk(id);
        if (!status) {
            return res.status(404).json({ success: false, message: "Statusi nuk u gjet." });
        }
        res.status(200).json({ success: true, data: status });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createStatus = async (req, res) => {
    try {
        const { name } = req.body;
        const newStatus = await ApplicationStatus.create({ name });
        res.status(201).json({ success: true, data: newStatus });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const status = await ApplicationStatus.findByPk(id);
        if (!status) {
            return res.status(404).json({ success: false, message: "Statusi nuk u gjet." });
        }
        status.name = name;
        await status.save();
        res.status(200).json({ success: true, data: status });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = await ApplicationStatus.findByPk(id);
        if (!status) {
            return res.status(404).json({ success: false, message: "Statusi nuk u gjet." });
        }
        await status.destroy();
        res.status(200).json({ success: true, message: "Statusi u fshi me sukses." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};