import express from "express";

import {
    getCompanies,
    createCompany,
    getCompanyById,
    getMyCompany,
    updateCompany,
    deleteCompany,
} from "../controllers/company.controllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/permissionMiddleware.js";

const router = express.Router();

router.post("/", createCompany);

router.get(
    "/",
    authMiddleware,
    authorizePermission("company:manage"),
    getCompanies
);

router.get(
    "/me",
    authMiddleware,
    getMyCompany
);

router.get(
    "/:id",
    authMiddleware,
    authorizePermission("company:manage"),
    getCompanyById
);

router.put(
    "/:id",
    authMiddleware,
    authorizePermission("company:manage"),
    updateCompany
);

router.delete(
    "/:id",
    authMiddleware,
    authorizePermission("company:manage"),
    deleteCompany
);

export default router;
