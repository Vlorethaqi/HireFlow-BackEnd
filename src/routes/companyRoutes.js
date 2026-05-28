import express from "express";
import jwt from "jsonwebtoken";

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

function optionalAuth(req, _res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
        try {
            req.user = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        } catch {
            req.user = null;
        }
    }

    next();
}

router.post("/", optionalAuth, createCompany);

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
