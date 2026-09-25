import { useState } from "react";
import type { Task, TaskStatus } from "../types";
import TaskTimer from "./TaskTimer";
import Modal from "./Modal";

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
  const [editOpen, setEditOpen] = useState(false);
  const [timerLoading, setTimerLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);;
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


  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <div>
        <h3 className={`font-semibold ${task.status === "COMPLETED" ? "line-through text-gray-400" : ""}`}>
          {task.title}
        </h3>
        {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
      </div>

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
          <button onClick={() => setEditOpen(true)} className="text-blue-600">
            Edit
          </button>
          <button onClick={() => setDeleteOpen(true)} className="text-red-600">
            Delete
          </button>
        </div>
      </div>

      <EditTaskModal
        open={editOpen}
        task={task}
        onClose={() => setEditOpen(false)}
        onSave={onUpdate}
      />
      <DeleteTaskModal
        open={deleteOpen}
        taskTitle={task.title}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
            await onDelete(task.id);
            setDeleteOpen(false);
        }}
        />
    </div>
  );
}

function EditTaskModal({
  open,
  task,
  onClose,
  onSave,
}: {
  open: boolean;
  task: Task;
  onClose: () => void;
  onSave: (id: string, data: { title?: string; description?: string | null }) => Promise<boolean>;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title can't be empty");
      return;
    }
    setSaving(true);
    setError("");
    const ok = await onSave(task.id, { title: title.trim(), description: description.trim() || null });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit task">
      <div className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={saving}
          className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} disabled={saving} className="px-3 py-1.5 rounded-lg border text-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
function DeleteTaskModal({
  open,
  taskTitle,
  onClose,
  onConfirm,
}: {
  open: boolean;
  taskTitle: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete task">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-medium text-gray-900">"{taskTitle}"</span>?
          This will also remove its time logs. This can't be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}