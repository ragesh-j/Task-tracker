import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) throw new AppError(401, "Not authenticated");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = { id: payload.id };
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
};