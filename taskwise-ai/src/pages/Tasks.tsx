import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, UserPlus } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import OwnerModal from "@/components/OwnerModal";
import AppLayout from "@/components/AppLayout";
import { Task, Status } from "@/lib/mockData";

const Tasks = () => {
  const { tasks, loading, owners } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [ownerFilter, setOwnerFilter] = useState("All");

  const filtered = tasks.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (ownerFilter !== "All" && t.owner !== ownerFilter) return false;
    return true;
  });

  const filterBtn = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
        active ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/30"
      }`}
    >
      {label}
    </button>
  );

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tasks</h1>
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
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "completed"] as const).map((s) =>
              filterBtn(s.charAt(0).toUpperCase() + s.slice(1), statusFilter === s, () => setStatusFilter(s))
            )}
            <div className="w-px h-6 bg-border mx-1" />
            {filterBtn("All Owners", ownerFilter === "All", () => setOwnerFilter("All"))}
            {owners.map((o) => filterBtn(o.name, ownerFilter === o.email, () => setOwnerFilter(o.email)))}
          </div>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">No tasks match your filters</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((task, i) => (
              <TaskCard key={task._id} task={task} index={i} onEdit={(t) => { setEditTask(t); setModalOpen(true); }} />
            ))}
          </div>
        )}
      </div>
      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} editTask={editTask} />
      <OwnerModal open={ownerModalOpen} onClose={() => setOwnerModalOpen(false)} />
    </AppLayout>
  );
};

export default Tasks;
