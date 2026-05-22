import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    Company,
    Permission,
    Role,
    RolePermission,
    User,
} from "../models/index.js";

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

async function createDefaultPermissions(roles) {
    const permissionData = [
        {
            name: "users:manage",
            description: "Manage company users",
        },
        {
            name: "company:manage",
            description: "Manage company profile",
        },
        {
            name: "jobs:manage",
            description: "Manage jobs",
        },
        {
            name: "applications:review",
            description: "Review job applications",
        },
        {
            name: "jobs:view",
            description: "View jobs",
        },
    ];

    const permissions = [];

    for (const item of permissionData) {
        const [permission] = await Permission.findOrCreate({
            where: {
                name: item.name,
            },
            defaults: item,
        });

        permissions.push(permission);
    }

    const adminRole = roles.find((role) => role.name === "ADMIN");
    const hrRole = roles.find((role) => role.name === "HR");
    const workerRole = roles.find((role) => role.name === "WORKER");

    const adminPermissions = permissions;
    const hrPermissions = permissions.filter((permission) =>
        ["jobs:manage", "applications:review", "jobs:view"].includes(permission.name)
    );
    const workerPermissions = permissions.filter((permission) =>
        ["jobs:view"].includes(permission.name)
    );

    const rolePermissions = [
        ...adminPermissions.map((permission) => ({
            roleId: adminRole.id,
            permissionId: permission.id,
        })),
        ...hrPermissions.map((permission) => ({
            roleId: hrRole.id,
            permissionId: permission.id,
        })),
        ...workerPermissions.map((permission) => ({
            roleId: workerRole.id,
            permissionId: permission.id,
        })),
    ];

    await RolePermission.bulkCreate(rolePermissions);
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
        if (existingUser.companyId) {
            const error = new Error("Admin email already belongs to another company");
            error.statusCode = 409;
            throw error;
        }
    }

    const company = await Company.create({
        name: finalCompanyName,
        email: finalCompanyEmail,
        phone,
        location,
        description,
    });

    const roles = await Role.bulkCreate([
        {
            name: "ADMIN",
            description: "Company administrator",
            companyId: company.id,
        },
        {
            name: "HR",
            description: "Human resources user",
            companyId: company.id,
        },
        {
            name: "WORKER",
            description: "Company worker",
            companyId: company.id,
        },
    ]);

    await createDefaultPermissions(roles);

    const adminRole = roles.find((role) => role.name === "ADMIN");
    let admin = existingUser;

    if (admin) {
        await admin.update({
            name: adminName || admin.name,
            role: "ADMIN",
            roleId: adminRole.id,
            companyId: company.id,
            isActive: true,
        });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        admin = await User.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
            roleId: adminRole.id,
            companyId: company.id,
        });
    }

    return {
        company,
        admin: removePassword(admin),
        token: createToken(admin),
    };
}

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
