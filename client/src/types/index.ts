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