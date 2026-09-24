import { Request, Response } from "express";
import * as taskService from "../services/task.service";

export const create = async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.user!.id, req.body);
  res.status(201).json(task);
};

export const list = async (req: Request, res: Response) => {
  res.json(await taskService.getTasks(req.user!.id));
};

export const getOne = async (req: Request, res: Response) => {
  res.json(await taskService.getTaskById(req.user!.id, req.params.id as string));
};

export const update = async (req: Request, res: Response) => {
  const task = await taskService.updateTask(req.user!.id, req.params.id as string, req.body);
  res.json(task);
};

export const remove = async (req: Request, res: Response) => {
  await taskService.deleteTask(req.user!.id, req.params.id as string);
  res.status(204).send();
};