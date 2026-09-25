import { useState } from "react";
import type { Task, TaskStatus } from "../types";
import TaskTimer from "./TaskTimer";

interface Props {
  task: Task;
  onUpdate: (
    id: string,
    data: { title?: string; description?: string | null; status?: TaskStatus }
  ) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onStart: (id: string) => Promise<boolean>;
  onStop: (id: string) => Promise<boolean>;
}

const statusLabel: Record<TaskStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export default function TaskItem({ task, onUpdate, onDelete, onStart, onStop }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [timerLoading, setTimerLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const running = task.activeStartTime !== null;

  const handleStart = async () => {
    if (timerLoading) return;
    setTimerLoading(true);
    await onStart(task.id);
    setTimerLoading(false);
  };

  const handleStop = async () => {
    if (timerLoading) return;
    setTimerLoading(true);
    await onStop(task.id);
    setTimerLoading(false);
  };

  const handleStatusChange = async (status: TaskStatus) => {
  if (statusLoading) return;
  setStatusLoading(true);
  await onUpdate(task.id, { status });
  setStatusLoading(false);
};
  const save = async () => {
    if (!title.trim()) return;
    const ok = await onUpdate(task.id, {
      title: title.trim(),
      description: description.trim() || null,
    });
    if (ok) setEditing(false);
  };

  const cancel = () => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setEditing(false);
  };

  const remove = () => {
    if (window.confirm("Delete this task?")) onDelete(task.id);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      {editing ? (
        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full border rounded-lg px-3 py-2"
          />
          <div className="flex gap-2">
            <button onClick={save} className="bg-blue-600 text-white rounded-lg px-3 py-1">
              Save
            </button>
            <button onClick={cancel} className="border rounded-lg px-3 py-1">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className={`font-semibold ${task.status === "COMPLETED" ? "line-through text-gray-400" : ""}`}>
            {task.title}
          </h3>
          {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <select
  value={task.status}
  disabled={statusLoading}
  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
  className="border rounded-lg px-2 py-1 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
>
  {(Object.keys(statusLabel) as TaskStatus[]).map((s) => (
    <option key={s} value={s}>
      {statusLabel[s]}
    </option>
  ))}
</select>

        <TaskTimer totalSeconds={task.totalSeconds} activeStartTime={task.activeStartTime} />

        {running ? (
          <button
            onClick={handleStop}
            disabled={timerLoading}
            className="bg-red-600 text-white rounded-lg px-3 py-1 text-sm disabled:opacity-60 disabled:cursor-not-allowed min-w-16"
          >
            {timerLoading ? "Stopping..." : "Stop"}
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={timerLoading || task.status === "COMPLETED"}
            className="bg-green-600 text-white rounded-lg px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-16"
          >
            {timerLoading ? "Starting..." : "Start"}
          </button>
        )}

        <div className="ml-auto flex gap-2 text-sm">
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-blue-600">
              Edit
            </button>
          )}
          <button onClick={remove} className="text-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}