import { Request, Response } from "express";
import * as aiService from "../services/ai.service";

export const suggest = async (req: Request, res: Response) => {
  const suggestion = await aiService.suggestTask(req.body.input);
  res.json(suggestion);
};