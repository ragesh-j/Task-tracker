import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

const publicUser = { id: true, name: true, email: true, createdAt: true };

export const signToken = (userId: string) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const signup = async (data: { name: string; email: string; password: string }) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError(409, "Email already registered");

  const password = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password },
    select: publicUser,
  });
  return { user, token: signToken(user.id) };
};

export const login = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  const valid = user && (await bcrypt.compare(data.password, user.password));
  if (!user || !valid) throw new AppError(401, "Invalid email or password");

  return {
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    token: signToken(user.id),
  };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUser });
  if (!user) throw new AppError(401, "User not found");
  return user;
};