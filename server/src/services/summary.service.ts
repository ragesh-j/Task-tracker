import { prisma } from "../lib/prisma";

export const getDailySummary = async (userId: string, from: Date, to: Date) => {
  const now = new Date();

  // Sessions that overlap the day (including a running timer)
  const logs = await prisma.timeLog.findMany({
    where: {
      userId,
      startTime: { lt: to },
      OR: [{ endTime: null }, { endTime: { gte: from } }],
    },
    include: { task: { select: { id: true, title: true, status: true } } },
  });

  const perTask = new Map<
    string,
    { id: string; title: string; status: string; seconds: number }
  >();
  let totalSeconds = 0;

  for (const log of logs) {
    const start = Math.max(log.startTime.getTime(), from.getTime());
    const end = Math.min((log.endTime ?? now).getTime(), to.getTime());
    const seconds = Math.max(0, Math.round((end - start) / 1000));
    totalSeconds += seconds;

    const row = perTask.get(log.task.id) ?? { ...log.task, seconds: 0 };
    row.seconds += seconds;
    perTask.set(log.task.id, row);
  }

  const [completedTasks, openTasks] = await Promise.all([
    prisma.task.findMany({
      where: { userId, status: "COMPLETED", updatedAt: { gte: from, lt: to } },
      select: { id: true, title: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.task.findMany({
      where: { userId, status: { in: ["PENDING", "IN_PROGRESS"] } },
      select: { id: true, title: true, status: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    from,
    to,
    totalSeconds,
    tasksWorkedOn: [...perTask.values()].sort((a, b) => b.seconds - a.seconds),
    completedTasks,
    inProgressTasks: openTasks.filter((t) => t.status === "IN_PROGRESS"),
    pendingTasks: openTasks.filter((t) => t.status === "PENDING"),
  };
};