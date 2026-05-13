import ApplicationStatus from "../models/ApplicationStatus.js";

export const getAllStatuses = async (req, res) => {
    try {

        const statuses = await ApplicationStatus.findAll();

        res.status(200).json(statuses);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};



export const getStatusById = async (req, res) => {
    try {

        const status = await ApplicationStatus.findByPk(req.params.id);

        if (!status) {
            return res.status(404).json({
                message: "Status not found",
            });
        }

        res.status(200).json(status);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};



export const createStatus = async (req, res) => {
    try {

        const status = await ApplicationStatus.create(req.body);

        res.status(201).json(status);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};



export const updateStatus = async (req, res) => {
    try {

        const status = await ApplicationStatus.findByPk(req.params.id);

        if (!status) {
            return res.status(404).json({
                message: "Status not found",
            });
        }

        await status.update(req.body);

        res.status(200).json(status);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};



export const deleteStatus = async (req, res) => {
    try {

        const status = await ApplicationStatus.findByPk(req.params.id);

        if (!status) {
            return res.status(404).json({
                message: "Status not found",
            });
        }

        await status.destroy();

        res.status(200).json({
            message: "Status deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};