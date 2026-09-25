import { CheckSquare } from "lucide-react";
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-300/80 rounded-md ${className}`} />;
}

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-3 w-1/3" />
          </div>
          <SkeletonBlock className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow space-y-3">
          <SkeletonBlock className="h-4 w-1/2" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4 auth-card">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-200">
            <CheckSquare size={26} className="text-white" />
          </div>
          <div className="absolute -inset-1 rounded-2xl border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-900">Task Tracker</p>
          <p className="text-sm text-gray-400">Loading your workspace...</p>
        </div>
      </div>
    </div>
  );
}