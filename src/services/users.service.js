import User from "../models/User.js";


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

  return await User.create(data);
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