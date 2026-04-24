import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Task, Priority, owners } from "@/lib/mockData";
import { useTasks } from "@/context/TaskContext";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  editTask?: Task | null;
}

const TaskModal = ({ open, onClose, editTask }: TaskModalProps) => {
  const { addTask, updateTask, owners, currentOwner } = useTasks();
  const [form, setForm] = useState({
    title: "",
    description: "",
    owner: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Medium" as Priority,
  });

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title,
        description: editTask.description,
        owner: editTask.owner,
        dueDate: new Date(editTask.dueDate).toISOString().split("T")[0],
        priority: editTask.priority,
      });
    } else {
      setForm({ 
        title: "", 
        description: "", 
        owner: currentOwner ? currentOwner.email : (owners.length > 0 ? owners[0].email : ""), 
        dueDate: new Date().toISOString().split("T")[0], 
        priority: "Medium" 
      });
    }
  }, [editTask, open, owners, currentOwner]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editTask) {
      updateTask(editTask._id, form);
    } else {
      addTask({ ...form, status: "pending", source: "Manual" });
    }
    onClose();
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-card w-full max-w-lg p-6 relative z-10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold" title={editTask ? "Edit Task" : "Add Task"}>{editTask ? "Edit Task" : "Add Task"}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Task title"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                <textarea
                  className={`${inputClass} resize-none h-20`}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Owner</label>
                  <select
                    title="Owner"
                    className={inputClass}
                    value={form.owner}
                    onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))}
                    required
                  >
                    <option value="" disabled>Select Owner</option>
                    {owners.map((o) => (
                      <option key={o._id} value={o.email}>{o.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Due Date</label>
                  <input
                    title="Due Date"
                    placeholder="Select due date"
                    type="date"
                    className={inputClass}
                    value={form.dueDate}
                    onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
                <div className="flex gap-2">
                  {(["Low", "Medium", "High"] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, priority: p }))}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                        form.priority === p
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {editTask ? "Update" : "Save Task"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
