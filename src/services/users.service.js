import { User } from "../models/index.js";
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

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
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

  await user.update(data);

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

  // recommended: soft delete
  await user.destroy();

  return true;
}
