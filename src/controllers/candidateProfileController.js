import CandidateProfile from "../models/CandidateProfile.js";



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