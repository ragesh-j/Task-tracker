import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api/axios";
import type { DailySummary } from "../types";
import { formatDuration } from "../utils/time";

export default function Summary() {
  const [data, setData] = useState<DailySummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);

    api
      .get<DailySummary>("/summary/today", {
        params: { from: from.toISOString(), to: to.toISOString() },
      })
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-gray-500">Loading summary...</p>
        ) : data ? (
          <>
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-sm text-gray-500">Total time tracked today</p>
              <p className="text-3xl font-bold font-mono">{formatDuration(data.totalSeconds)}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="font-semibold mb-2">Tasks worked on today</h2>
              {data.tasksWorkedOn.length === 0 ? (
                <p className="text-gray-500 text-sm">No time tracked yet today.</p>
              ) : (
                <ul className="space-y-1">
                  {data.tasksWorkedOn.map((t) => (
                    <li key={t.id} className="flex justify-between text-sm">
                      <span>{t.title}</span>
                      <span className="font-mono">{formatDuration(t.seconds)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <SummaryList title="Completed today" items={data.completedTasks.map((t) => t.title)} />
              <SummaryList title="In progress" items={data.inProgressTasks.map((t) => t.title)} />
              <SummaryList title="Pending" items={data.pendingTasks.map((t) => t.title)} />
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

function SummaryList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-2">{title}</h3>
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">None</p>
      ) : (
        <ul className="text-sm space-y-1 list-disc list-inside">
          {items.map((title, i) => (
            <li key={i}>{title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}