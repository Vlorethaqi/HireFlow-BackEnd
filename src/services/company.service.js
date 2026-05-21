import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Company, User } from "../models/index.js";

function createToken(user) {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
            companyId: user.companyId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
}

function removePassword(user) {
    const { password, ...safeUser } = user.toJSON();
    return safeUser;
}

// GET COMPANIES
export async function getCompaniesService(companyId) {
    return await Company.findAll({
        where: {
            id: companyId,
        },
    });
}

// GET MY COMPANY
export async function getMyCompanyService(companyId) {
    return await Company.findByPk(companyId);
}

// GET COMPANY BY ID
export async function getCompanyByIdService(id, companyId) {
    if (Number(id) !== Number(companyId)) {
        return null;
    }

    return await Company.findByPk(companyId);
}

// CREATE COMPANY + ADMIN USER
export async function createCompanyService(data) {
    const {
        name,
        companyName,
        email,
        companyEmail,
        phone,
        location,
        description,
        adminName,
        adminEmail,
        password,
    } = data;

    const finalCompanyName = name || companyName;
    const finalCompanyEmail = companyEmail || email;

    if (!finalCompanyName || !finalCompanyEmail || !adminName || !adminEmail || !password) {
        const error = new Error(
            "Company name, company email, admin name, admin email and password are required"
        );
        error.statusCode = 400;
        throw error;
    }

    const existingCompany = await Company.findOne({
        where: {
            email: finalCompanyEmail,
        },
    });

    if (existingCompany) {
        const error = new Error("Company email already exists");
        error.statusCode = 409;
        throw error;
    }

    const existingUser = await User.findOne({
        where: {
            email: adminEmail,
        },
    });

    if (existingUser) {
        const error = new Error("Admin email already exists");
        error.statusCode = 409;
        throw error;
    }

    const company = await Company.create({
        name: finalCompanyName,
        email: finalCompanyEmail,
        phone,
        location,
        description,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        companyId: company.id,
    });

    return {
        company,
        admin: removePassword(admin),
        token: createToken(admin),
    };
}

// UPDATE COMPANY
export async function updateCompanyService(id, data, companyId) {
    const company = await getCompanyByIdService(id, companyId);

    if (!company) {
        return null;
    }

    await company.update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        description: data.description,
        isActive: data.isActive,
    });

    return company;
}

// DELETE COMPANY (SOFT DELETE)
export async function deleteCompanyService(id, companyId) {
    const company = await getCompanyByIdService(id, companyId);

    if (!company) {
        return null;
    }

    await company.update({
        isActive: false,
    });

    return true;
}
