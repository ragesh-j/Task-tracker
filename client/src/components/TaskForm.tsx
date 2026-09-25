import { useState } from "react";
import type { FormEvent } from "react";

export default function TaskForm({
  onCreate,
}: {
  onCreate: (title: string, description: string) => Promise<boolean>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Enter a task");
      return;
    }
    setError("");
    const ok = await onCreate(title.trim(), description.trim());
    if (ok) {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white p-4 rounded-xl shadow space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you need to do? e.g. follow up with designer"
        className="w-full border rounded-lg px-3 py-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full border rounded-lg px-3 py-2"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2">
        Add task
      </button>
    </form>
  );
}