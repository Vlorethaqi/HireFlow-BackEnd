import User from "../models/users.js";

export async function getAllUsersService() {
  return await User.findAll();
}

export async function getUserByIdService(id) {
  return await User.findByPk(id);
}

export async function createUserService(data) {
  return await User.create(data);
}

export async function updateUserService(id, data) {
  const user = await User.findByPk(id);

  if (!user) return null;

  await user.update(data);

  return user;
}

export async function deleteUserService(id) {
  const user = await User.findByPk(id);

  if (!user) return null;

  await user.destroy();

  return true;
}