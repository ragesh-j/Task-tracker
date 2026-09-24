import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <p className="mb-4">Hello, {user?.name}</p>
      <button onClick={logout} className="px-4 py-2 rounded-lg bg-gray-800 text-white">
        Log out
      </button>
    </div>
  );
}