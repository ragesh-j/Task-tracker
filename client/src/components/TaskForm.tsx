import { useState } from "react";
import type { FormEvent } from "react";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { api, getErrorMessage } from "../api/axios";

export default function TaskForm({
  onCreate,
}: {
  onCreate: (title: string, description: string) => Promise<boolean>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  const handleSuggest = async () => {
    if (!title.trim() || suggesting) return;
    setSuggesting(true);
    setError("");
    try {
      const res = await api.post<{ title: string; description: string }>("/ai/suggest", {
        input: title.trim(),
      });
      setTitle(res.data.title);
      if (res.data.description) setDescription(res.data.description);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSuggesting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!title.trim()) {
      setError("Enter a task");
      return;
    }
    setError("");
    setSubmitting(true);
    const ok = await onCreate(title.trim(), description.trim());
    setSubmitting(false);
    if (ok) {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
      <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
        <div className="w-6 h-6 rounded-lg bg-linear-to-br from-indigo-600 to-violet-500 flex items-center justify-center">
          <Plus size={14} className="text-white" />
        </div>
        New task
      </div>

      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to do? e.g. follow up with designer"
          disabled={submitting}
          className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 disabled:bg-gray-50 transition-colors"
        />
        <button
          type="button"
          onClick={handleSuggest}
          disabled={suggesting || submitting || !title.trim()}
          title="Improve with AI"
          className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 transition-colors"
        >
          {suggesting ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          <span className="hidden sm:inline">{suggesting ? "Thinking..." : "Suggest"}</span>
        </button>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        disabled={submitting}
        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 disabled:bg-gray-50 transition-colors"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 w-full sm:w-auto bg-linear-to-br from-indigo-600 to-violet-500 text-white rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {submitting ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Plus size={15} />
            Add task
          </>
        )}
      </button>
    </form>
  );
}