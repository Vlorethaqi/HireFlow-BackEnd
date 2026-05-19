import * as userService from "../services/users.service.js";


// GET ALL USERS (multi-tenant)
export async function getAllUsers(req, res, next) {
  try {
    const companyId = req.user.companyId;

    const users = await userService.getAllUsersService(companyId);

    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    next(error);
  }
}


// GET USER BY ID
export async function getUserById(req, res, next) {
  try {
    const companyId = req.user.companyId;
    const id = req.params.id;

    const user = await userService.getUserByIdService(id, companyId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
}


// CREATE USER
export async function createUser(req, res, next) {
  try {
    const companyId = req.user.companyId;

    const userData = {
      ...req.body,
      companyId
    };

    const user = await userService.createUserService(userData);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });

  } catch (error) {
    next(error);
  }
}


// UPDATE USER
export async function updateUser(req, res, next) {
  try {
    const companyId = req.user.companyId;
    const id = req.params.id;

    const updatedUser = await userService.updateUserService(
      id,
      req.body,
      companyId
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (error) {
    next(error);
  }
}


// DELETE USER
export async function deleteUser(req, res, next) {
  try {
    const companyId = req.user.companyId;
    const id = req.params.id;

    const deleted = await userService.deleteUserService(id, companyId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    next(error);
  }
}