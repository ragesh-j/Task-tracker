import { Link, useLocation } from "react-router-dom";
import { CheckSquare, Clock, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const links = [
  { to: "/", label: "Tasks", icon: CheckSquare },
  { to: "/timelogs", label: "Time Logs", icon: Clock },
  { to: "/summary", label: "Summary", icon: BarChart3 },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-16 grid grid-cols-3 items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-700 to-blue-600 flex items-center justify-center shrink-0">
            <CheckSquare size={17} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 hidden sm:inline">Task Tracker</span>
        </div>

        <nav className="flex items-center justify-center gap-1 bg-gray-100 rounded-full p-1 mx-auto">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <span className="hidden md:inline text-sm text-gray-600">{user?.name}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}