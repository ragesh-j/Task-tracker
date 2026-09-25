export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  totalSeconds: number;
  activeStartTime: string | null;
}

export interface TimeLog {
  id: string;
  taskId: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  task: { id: string; title: string };
}

export interface DailySummary {
  from: string;
  to: string;
  totalSeconds: number;
  tasksWorkedOn: { id: string; title: string; status: string; seconds: number }[];
  completedTasks: { id: string; title: string; updatedAt: string }[];
  inProgressTasks: { id: string; title: string; status: string }[];
  pendingTasks: { id: string; title: string; status: string }[];
}