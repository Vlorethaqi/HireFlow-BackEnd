import express from "express";

import * as userController
from "../controllers/users.controller.js";

import {
  authMiddleware
} from "../middlewares/authMiddleware.js";

import {
  authorizeRoles
} from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "HR"),
  userController.getAllUsers
);

router.get(
  "/:id",
  authMiddleware,
  userController.getUserById
);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  userController.createUser
);

router.put(
  "/:id",
  authMiddleware,
  userController.updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  userController.deleteUser
);

console.log("userController:", userController);

export default router;