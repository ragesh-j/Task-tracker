import { useTasks } from "../hooks/useTasks";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import { SkeletonList } from "../components/Skeleton";

export default function Dashboard() {
 
  const { tasks, loading, error, createTask, updateTask, deleteTask, startTimer, stopTimer } =
    useTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <TaskForm onCreate={createTask} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        {loading ? (
          <SkeletonList rows={3} />
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