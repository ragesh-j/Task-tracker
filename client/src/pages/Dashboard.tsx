import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { tasks, loading, error, createTask, updateTask, deleteTask, startTimer, stopTimer } =
    useTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-lg">Task Tracker</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">{user?.name}</span>
            <Link to="/timelogs" className="text-blue-600">
                Time Logs
            </Link>
            <button onClick={logout} className="px-3 py-1 rounded-lg bg-gray-800 text-white">
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <TaskForm onCreate={createTask} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Add your first one above.</p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onStart={startTimer}
              onStop={stopTimer}
            />
          ))
        )}
      </main>
    </div>
  );
}