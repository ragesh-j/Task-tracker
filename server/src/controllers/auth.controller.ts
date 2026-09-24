import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { cookieOptions, cookieMaxAge } from "../utils/cookie";

export const signup = async (req: Request, res: Response) => {
  const { user, token } = await authService.signup(req.body);
  res.cookie("token", token, { ...cookieOptions, maxAge: cookieMaxAge });
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { user, token } = await authService.login(req.body);
  res.cookie("token", token, { ...cookieOptions, maxAge: cookieMaxAge });
  res.json(user);
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
};

export const me = async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  res.json(user);
};