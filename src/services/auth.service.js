import { Role, User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
}

function createAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      companyId: user.companyId
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      tokenType: "refresh"
    },
    getRefreshSecret(),
    { expiresIn: "7d" }
  );
}

function removePassword(user) {
  const { password: _, ...safeUser } = user.toJSON();
  return safeUser;
}

// REGISTER
export async function registerService(data) {
  if (!data) {
    throw new Error("Request body is missing");
  }

  const { name, email, password, role, companyId } = data;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const existingUser = await User.findOne({
    where: { email }
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let roleId = null;
  const userRole = role || "CANDIDATE";

  if (companyId) {
    const savedRole = await Role.findOne({
      where: {
        name: userRole,
        companyId
      }
    });

    roleId = savedRole?.id || null;
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: userRole,
    roleId,
    companyId
  });

  // mos e kthe password
  return removePassword(user);
}


// LOGIN
export async function loginService(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

 const user = await User.findOne({
  where: { email },
  attributes: {
    include: ["password"]
  }
});

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const safeUser = removePassword(user);
  const token = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return {
    user: safeUser,
    token,
    accessToken: token,
    refreshToken
  };
}

export async function refreshTokenService(refreshToken) {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, getRefreshSecret());
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  if (decoded.tokenType !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findByPk(decoded.id, {
    attributes: {
      include: ["password"]
    }
  });

  if (!user || user.isActive === false) {
    throw new Error("User not found or inactive");
  }

  const token = createAccessToken(user);
  const nextRefreshToken = createRefreshToken(user);

  return {
    user: removePassword(user),
    token,
    accessToken: token,
    refreshToken: nextRefreshToken
  };
}
