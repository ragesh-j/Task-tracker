import { useCallback, useEffect, useState } from "react";
import { api, getErrorMessage } from "../api/axios";
import type { Task, TaskStatus } from "../types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get<Task[]>("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Runs an API call, then reloads the list. Returns true on success.
  const run = async (fn: () => Promise<unknown>) => {
    setError("");
    try {
      await fn();
      await fetchTasks();
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask: (title: string, description: string) =>
      run(() => api.post("/tasks", { title, description: description || undefined })),
    updateTask: (
      id: string,
      data: { title?: string; description?: string | null; status?: TaskStatus }
    ) => run(() => api.patch(`/tasks/${id}`, data)),
    deleteTask: (id: string) => run(() => api.delete(`/tasks/${id}`)),
    startTimer: (taskId: string) => run(() => api.post("/timelogs/start", { taskId })),
    stopTimer: (taskId: string) => run(() => api.post("/timelogs/stop", { taskId })),
  };
}