import * as companyService from "../services/company.service.js";

export const getCompanies = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const companies = await companyService.getCompaniesService(companyId);

        res.status(200).json({
            success: true,
            data: companies,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createCompany = async (req, res) => {
    try {
        if (req.user?.role === "HR") {
            return res.status(403).json({
                success: false,
                message: "HR users can review applications only and cannot create companies.",
            });
        }

        const result = await companyService.createCompanyService(req.body, req.user?.id);

        res.status(201).json({
            success: true,
            message: "Company and admin user created successfully",
            ...result,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const company = await companyService.getCompanyByIdService(
            req.params.id,
            companyId
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyCompany = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const company = await companyService.getMyCompanyService(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const company = await companyService.updateCompanyService(
            req.params.id,
            req.body,
            companyId
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            data: company,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        const deleted = await companyService.deleteCompanyService(
            req.params.id,
            companyId
        );

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Company deactivated successfully",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};
