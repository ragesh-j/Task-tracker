import { Request, Response } from "express";
import * as summaryService from "../services/summary.service";
import { summaryQuerySchema } from "../schemas/summary.schema";
import { AppError } from "../utils/AppError";

export const today = async (req: Request, res: Response) => {
  const parsed = summaryQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0]?.message ?? "Invalid query");
  }

  // Default: the current UTC day
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const from = parsed.data.from ?? start;
  const to = parsed.data.to ?? new Date(from.getTime() + 24 * 60 * 60 * 1000);

  res.json(await summaryService.getDailySummary(req.user!.id, from, to));
};