import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import type { Task } from "../generated/prisma/client";

const include = {
  timeLogs: { select: { duration: true, startTime: true, endTime: true } },
};

type TaskWithLogs = Task & {
  timeLogs: { duration: number | null; startTime: Date; endTime: Date | null }[];
};

// totalSeconds = finished sessions only. Frontend adds the running time.
const format = (task: TaskWithLogs) => {
  const { timeLogs, ...rest } = task;
  const totalSeconds = timeLogs.reduce((sum, l) => sum + (l.duration ?? 0), 0);
  const active = timeLogs.find((l) => !l.endTime);
  return { ...rest, totalSeconds, activeStartTime: active?.startTime ?? null };
};

export const createTask = async (
  userId: string,
  data: { title: string; description?: string | undefined; status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | undefined }
) => {
  const task = await prisma.task.create({ data: { ...data, userId }, include });
  return format(task);
};

export const getTasks = async (userId: string) => {
  const tasks = await prisma.task.findMany({
    where: { userId },
    include,
    orderBy: { createdAt: "desc" },
  });
  return tasks.map(format);
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId }, include });
  if (!task) throw new AppError(404, "Task not found");
  return format(task);
};

export const updateTask = async (
  userId: string,
  taskId: string,
  data: { title?: string; description?: string | null; status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" }
) => {
  await getTaskById(userId, taskId); // ownership check
  const task = await prisma.task.update({ where: { id: taskId }, data, include });
  return format(task);
};

export const deleteTask = async (userId: string, taskId: string) => {
  await getTaskById(userId, taskId); // ownership check
  await prisma.task.delete({ where: { id: taskId } });
};