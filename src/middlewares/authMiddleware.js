// middleware/auth.middleware.js

import jwt from "jsonwebtoken";

export function authMiddleware(
  req,
  res,
  next
) {

  const authHeader =
    req.headers.authorization;

  if (!authHeader) {

    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  if (
    !authHeader.startsWith("Bearer ")
  ) {

    return res.status(401).json({
      success: false,
      message: "Invalid token format"
    });
  }

  const token =
    authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}