import { Role, User } from "../models/index.js";
import bcrypt from "bcrypt";


// GET ALL USERS
export async function getAllUsersService(companyId) {

  return await User.findAll({
    where: {
      companyId,
      isActive: true
    },
    attributes: {
      exclude: ["password"]
    }
  });
}


// GET USER BY ID
export async function getUserByIdService(id, companyId) {

  return await User.findOne({
    where: {
      id,
      companyId,
      isActive: true
    },
    attributes: {
      exclude: ["password"]
    }
  });
}


// CREATE USER TO COMPANY
export async function createUserService(data) {

  // FIND EXISTING REGISTERED USER
  const existingUser = await User.findOne({
    where: {
      email: data.email
    }
  });

  // USER NOT REGISTERED
  if (!existingUser) {
    const error = new Error(
      "User with this email is not registered"
    );
    error.statusCode = 404;
    throw error;
  }

  // USER BELONGS TO ANOTHER COMPANY
  if (
    existingUser.companyId &&
    Number(existingUser.companyId) !== Number(data.companyId)
  ) {
    const error = new Error(
      "User already belongs to another company"
    );
    error.statusCode = 409;
    throw error;
  }

  // USER ALREADY IN SAME COMPANY
  if (
    Number(existingUser.companyId) === Number(data.companyId) &&
    existingUser.isActive
  ) {
    const error = new Error(
      "User already exists in this company"
    );
    error.statusCode = 409;
    throw error;
  }

  // ROLE VALIDATION
  const roleName = data.role || "WORKER";

  if (!["HR", "WORKER"].includes(roleName)) {
    const error = new Error(
      "Admin can assign only HR or WORKER role"
    );
    error.statusCode = 400;
    throw error;
  }

  // FIND ROLE
  let role = await Role.findOne({
    where: {
      name: roleName,
      companyId: data.companyId
    }
  });

  // CREATE ROLE IF NOT EXISTS
  if (!role) {
    role = await Role.create({
      name: roleName,
      description: `${roleName} user`,
      companyId: data.companyId
    });
  }

  // ASSIGN USER TO COMPANY
  await existingUser.update({
    companyId: data.companyId,
    role: roleName,
    roleId: role.id,
    isActive: true
  });

  const { password, ...safeUser } =
    existingUser.toJSON();

  return safeUser;
}

// UPDATE USER
export async function updateUserService(
  id,
  data,
  companyId
) {

  const user = await User.findOne({
    where: {
      id,
      companyId,
      isActive: true
    }
  });

  if (!user) return null;

  const updateData = { ...data };

  // EMAIL VALIDATION
  if (data.email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
      const error = new Error("Invalid email format");
      error.statusCode = 400;
      throw error;
    }

    const existingEmail = await User.findOne({
      where: {
        email: data.email
      }
    });

    if (
      existingEmail &&
      Number(existingEmail.id) !== Number(id)
    ) {
      const error = new Error("Email already in use");
      error.statusCode = 409;
      throw error;
    }
  }

  // ROLE VALIDATION
  if (data.role) {

    if (!["HR", "WORKER"].includes(data.role)) {
      const error = new Error(
        "Admin can assign only HR or WORKER role"
      );
      error.statusCode = 400;
      throw error;
    }

    let role = await Role.findOne({
      where: {
        name: data.role,
        companyId
      }
    });

    // CREATE ROLE IF NOT EXISTS
    if (!role) {
      role = await Role.create({
        name: data.role,
        description: `${data.role} user`,
        companyId
      });
    }

    updateData.roleId = role.id;
  }

  // HASH PASSWORD IF UPDATED
  if (data.password) {
    updateData.password = await bcrypt.hash(
      data.password,
      10
    );
  }

  await user.update(updateData);

  const { password, ...safeUser } = user.toJSON();

  return safeUser;
}


// DELETE USER (SOFT DELETE)
export async function deleteUserService(
  id,
  companyId
) {

  const user = await User.findOne({
    where: {
      id,
      companyId,
      isActive: true
    }
  });

  if (!user) return null;

  // PREVENT ADMIN DELETE
  if (user.role === "ADMIN") {
    const error = new Error(
      "Admin user cannot be deleted"
    );
    error.statusCode = 400;
    throw error;
  }

  // SOFT DELETE
  await user.update({
    isActive: false
  });

  return true;
}