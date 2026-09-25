import { useEffect, useState } from "react";
import { formatDuration } from "../utils/time";

function RunningTime({ totalSeconds, startTime }: { totalSeconds: number; startTime: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const running = Math.max(0, (now - new Date(startTime).getTime()) / 1000);
  return (
    <span className="font-mono text-green-600">{formatDuration(totalSeconds + running)}</span>
  );
}

export default function TaskTimer({
  totalSeconds,
  activeStartTime,
}: {
  totalSeconds: number;
  activeStartTime: string | null;
}) {
  if (activeStartTime) {
    return <RunningTime totalSeconds={totalSeconds} startTime={activeStartTime} />;
  }
  return <span className="font-mono text-gray-600">{formatDuration(totalSeconds)}</span>;
}