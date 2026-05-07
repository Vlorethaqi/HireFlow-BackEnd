import { Company } from "../models/index.js";

export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll();
        res.json(companies);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const createCompany = async (req, res) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
            });
        }

        res.json(company);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
            });
        }

        await company.update(req.body);

        res.json(company);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
            });
        }

        await company.destroy();

        res.json({
            message: "Company deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};