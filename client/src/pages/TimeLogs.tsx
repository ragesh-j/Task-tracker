import { useEffect, useState } from "react";
import { Clock, PlayCircle } from "lucide-react";
import { api, getErrorMessage } from "../api/axios";
import type { TimeLog } from "../types";
import { formatDuration } from "../utils/time";
import { SkeletonList } from "../components/Skeleton";


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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-600 to-violet-500 flex items-center justify-center">
          <Clock size={16} className="text-white" />
        </div>
        <h1 className="font-bold text-lg text-gray-900">Time Logs</h1>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <SkeletonList />
      ) : logs.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <Clock size={28} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 text-sm">No time logs yet. Start a timer on a task.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const running = !log.endTime;
            return (
              <div
                key={log.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      running ? "bg-green-500 animate-pulse" : "bg-gray-300"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{log.task.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(log.startTime).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {" – "}
                      {running ? (
                        <span className="text-green-600 font-medium">Running</span>
                      ) : (
                        new Date(log.endTime!).toLocaleString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 font-mono text-sm font-medium text-gray-700">
                  {running && <PlayCircle size={14} className="text-green-500" />}
                  {log.duration !== null ? formatDuration(log.duration) : "—"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}