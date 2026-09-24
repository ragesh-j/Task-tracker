import { Request, Response } from "express";
import * as timeLogService from "../services/timelog.service";

export const start = async (req: Request, res: Response) => {
  const log = await timeLogService.startTimer(req.user!.id, req.body.taskId);
  res.status(201).json(log);
};

export const stop = async (req: Request, res: Response) => {
  const log = await timeLogService.stopTimer(req.user!.id, req.body.taskId);
  res.json(log);
};

export const list = async (req: Request, res: Response) => {
  const taskId = typeof req.query.taskId === "string" ? req.query.taskId : undefined;
  res.json(await timeLogService.getTimeLogs(req.user!.id, taskId));
};

export const remove = async (req: Request, res: Response) => {
  await timeLogService.deleteTimeLog(req.user!.id, req.params.id as string);
  res.status(204).send();
};