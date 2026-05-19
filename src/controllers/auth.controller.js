import * as authService from "../services/auth.service.js";

// REGISTER
export async function register(req, res, next) {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing"
      });
    }

    const user = await authService.registerService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    });

  } catch (error) {
    next(error);
  }
}

// LOGIN
export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    const result = await authService.loginService(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...result
    });

  } catch (error) {
    next(error);
  }
}