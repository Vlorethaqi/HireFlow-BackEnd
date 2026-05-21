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
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", createCompany);

router.get(
    "/",
    authMiddleware,
    authorizeRoles("ADMIN"),
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
    authorizeRoles("ADMIN"),
    getCompanyById
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    updateCompany
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    deleteCompany
);

export default router;
