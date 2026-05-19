import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "CANDIDATE",
    companyId
  });

  // mos e kthe password
  const { password: _, ...safeUser } = user.toJSON();

  return safeUser;
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

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      companyId: user.companyId
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const { password: _, ...safeUser } = user.toJSON();

  return {
    user: safeUser,
    token
  };
}