import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api/axios";
import type { TimeLog } from "../types";
import { formatDuration } from "../utils/time";

export default function TimeLogs() {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<TimeLog[]>("/timelogs")
      .then((res) => setLogs(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-3xl mx-auto px-4 py-6">
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        {loading ? (
          <p className="text-gray-500">Loading time logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">No time logs yet. Start a timer on a task.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-2">Task</th>
                  <th className="px-4 py-2">Started</th>
                  <th className="px-4 py-2">Ended</th>
                  <th className="px-4 py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="px-4 py-2">{log.task.title}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(log.startTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {log.endTime ? (
                        new Date(log.endTime).toLocaleString()
                      ) : (
                        <span className="text-green-600">Running</span>
                      )}
                    </td>
                    <td className="px-4 py-2 font-mono">
                      {log.duration !== null ? formatDuration(log.duration) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}