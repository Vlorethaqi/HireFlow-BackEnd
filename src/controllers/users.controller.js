import * as userService from "../services/users.service.js";

export async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsersService();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await userService.getUserByIdService(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export async function createUser(req, res) {
  try {
    const user = await userService.createUserService(req.body);

    res.status(201).json({
      message: "User created successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export async function updateUser(req, res) {
  try {
    const updatedUser = await userService.updateUserService(
      req.params.id,
      req.body
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const deleted = await userService.deleteUserService(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}