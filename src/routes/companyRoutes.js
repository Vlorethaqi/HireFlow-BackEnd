import express from "express";

import {
    getCompanies,
    createCompany,
    getCompanyById,
    updateCompany,
    deleteCompany,
} from "../controllers/company.controllers.js";

const router = express.Router();

router.get("/", getCompanies);
router.post("/", createCompany);
router.get("/:id", getCompanyById);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;