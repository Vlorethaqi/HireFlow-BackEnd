import express from "express";

import * as userController
from "../controllers/users.controller.js";

import {
  authMiddleware
} from "../middlewares/authMiddleware.js";

import {
  authorizePermission
} from "../middlewares/permissionMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorizePermission("users:manage"),
  userController.getAllUsers
);

router.get(
  "/:id",
  authMiddleware,
  authorizePermission("users:manage"),
  userController.getUserById
);

router.post(
  "/",
  authMiddleware,
  authorizePermission("users:manage"),
  userController.createUser
);

router.put(
  "/:id",
  authMiddleware,
  authorizePermission("users:manage"),
  userController.updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  authorizePermission("users:manage"),
  userController.deleteUser
);

export default router;
