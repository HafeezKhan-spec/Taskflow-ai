import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, CalendarCheck, Plus, UserPlus } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import DashboardCard from "@/components/DashboardCard";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import OwnerModal from "@/components/OwnerModal";
import AppLayout from "@/components/AppLayout";
import { Task } from "@/lib/mockData";

const Dashboard = () => {
  const { tasks } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Get local start of today
  const getLocalDateString = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const todayStr = getLocalDateString(new Date());

  const overdue = tasks.filter((t) => {
    const taskDateStr = getLocalDateString(t.dueDate);
    return taskDateStr < todayStr && t.status === "pending";
  });
  const dueToday = tasks.filter((t) => {
    const taskDateStr = getLocalDateString(t.dueDate);
    return taskDateStr === todayStr && t.status === "pending";
  });
  const upcoming = tasks.filter((t) => {
    const taskDateStr = getLocalDateString(t.dueDate);
    return taskDateStr > todayStr && t.status === "pending";
  });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Welcome back, here's your overview</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setOwnerModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              <UserPlus className="w-4 h-4" /> Add Owner
            </button>
            <button
              onClick={() => { setEditTask(null); setModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DashboardCard title="Overdue Tasks" count={overdue.length} icon={AlertTriangle} variant="overdue" />
          <DashboardCard title="Due Today" count={dueToday.length} icon={Clock} variant="today" />
          <DashboardCard title="Upcoming" count={upcoming.length} icon={CalendarCheck} variant="upcoming" />
        </div>

        {/* Task overview */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Tasks</h2>
          {tasks.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground">No tasks yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {tasks.slice(0, 6).map((task, i) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={i}
                  onEdit={(t) => { setEditTask(t); setModalOpen(true); }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} editTask={editTask} />
      <OwnerModal open={ownerModalOpen} onClose={() => setOwnerModalOpen(false)} />
    </AppLayout>
  );
};

export default Dashboard;
