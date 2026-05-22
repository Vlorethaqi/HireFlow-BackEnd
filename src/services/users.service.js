import { Role, User } from "../models/index.js";
import bcrypt from "bcrypt";


// GET ALL USERS
export async function getAllUsersService(companyId) {
  return await User.findAll({
    where: {
      companyId
    }
  });
}


// GET USER BY ID
export async function getUserByIdService(id, companyId) {
  return await User.findOne({
    where: {
      id,
      companyId
    }
  });
}


// CREATE USER
export async function createUserService(data) {
  if (!data.password) {
    const error = new Error("Password is required");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({
    where: {
      email: data.email
    }
  });

  const roleName = data.role || "WORKER";

  if (!["HR", "WORKER"].includes(roleName)) {
    const error = new Error("Admin can assign only HR or WORKER role");
    error.statusCode = 400;
    throw error;
  }

  let role = await Role.findOne({
    where: {
      name: roleName,
      companyId: data.companyId
    }
  });

  if (!role) {
    role = await Role.create({
      name: roleName,
      description: `${roleName} user`,
      companyId: data.companyId
    });
  }

  if (existingUser) {
    if (
      existingUser.companyId &&
      Number(existingUser.companyId) !== Number(data.companyId)
    ) {
      const error = new Error("Email already belongs to another company");
      error.statusCode = 409;
      throw error;
    }

    await existingUser.update({
      name: data.name || existingUser.name,
      role: roleName,
      roleId: role.id,
      companyId: data.companyId,
      isActive: true
    });

    const { password: _, ...safeUser } = existingUser.toJSON();

    return safeUser;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    role: roleName,
    roleId: role.id,
    password: hashedPassword
  });

  const { password: _, ...safeUser } = user.toJSON();

  return safeUser;
}


// UPDATE USER
export async function updateUserService(id, data, companyId) {

  const user = await User.findOne({
    where: {
      id,
      companyId
    }
  });

  if (!user) return null;

  const updateData = { ...data };

  if (data.role) {
    if (!["HR", "WORKER"].includes(data.role)) {
      const error = new Error("Admin can assign only HR or WORKER role");
      error.statusCode = 400;
      throw error;
    }

    let role = await Role.findOne({
      where: {
        name: data.role,
        companyId
      }
    });

    if (!role) {
      role = await Role.create({
        name: data.role,
        description: `${data.role} user`,
        companyId
      });
    }

    updateData.roleId = role.id;
  }

  await user.update(updateData);

  return user;
}


// DELETE USER (SOFT DELETE)
export async function deleteUserService(id, companyId) {

  const user = await User.findOne({
    where: {
      id,
      companyId
    }
  });

  if (!user) return null;

  if (user.role === "ADMIN") {
    const error = new Error("Admin user cannot be deleted");
    error.statusCode = 400;
    throw error;
  }

  // recommended: soft delete
  await user.destroy();

  return true;
}
