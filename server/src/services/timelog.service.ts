import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export const startTimer = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) throw new AppError(404, "Task not found");

  const active = await prisma.timeLog.findFirst({
    where: { taskId, userId, endTime: null },
  });
  if (active) throw new AppError(409, "Timer already running for this task");

  const log = await prisma.timeLog.create({ data: { taskId, userId } });

  if (task.status === "PENDING") {
    await prisma.task.update({ where: { id: taskId }, data: { status: "IN_PROGRESS" } });
  }
  return log;
};

export const stopTimer = async (userId: string, taskId: string) => {
  const active = await prisma.timeLog.findFirst({
    where: { taskId, userId, endTime: null },
  });
  if (!active) throw new AppError(400, "No running timer for this task");

  const endTime = new Date();
  const duration = Math.max(
    0,
    Math.round((endTime.getTime() - active.startTime.getTime()) / 1000)
  );

  return prisma.timeLog.update({
    where: { id: active.id },
    data: { endTime, duration },
  });
};

export const getTimeLogs = async (userId: string, taskId?: string) => {
  return prisma.timeLog.findMany({
    where: { userId, ...(taskId ? { taskId } : {}) },
    include: { task: { select: { id: true, title: true } } },
    orderBy: { startTime: "desc" },
  });
};

export const deleteTimeLog = async (userId: string, logId: string) => {
  const log = await prisma.timeLog.findFirst({ where: { id: logId, userId } });
  if (!log) throw new AppError(404, "Time log not found");
  await prisma.timeLog.delete({ where: { id: logId } });
};