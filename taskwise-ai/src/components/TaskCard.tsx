import { Task } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Calendar, User, Trash2, CheckCircle2, Circle, Mail, Database, Layout } from "lucide-react";
import { useTasks } from "@/context/TaskContext";

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
}

const priorityBadge = {
  Low: "bg-info/10 text-info",
  Medium: "bg-warning/10 text-warning",
  High: "bg-destructive/10 text-destructive",
};

const sourceIcons = {
  Manual: <User className="w-3 h-3" />,
  Outlook: <Mail className="w-3 h-3 text-blue-400" />,
  Salesforce: <Database className="w-3 h-3 text-blue-600" />,
  Monday: <Layout className="w-3 h-3 text-pink-500" />,
};

const TaskCard = ({ task, index, onEdit }: TaskCardProps) => {
  const { deleteTask, toggleStatus } = useTasks();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-4 hover-lift group"
    >
      <div className="flex items-start gap-3">
        <button onClick={() => toggleStatus(task._id)} className="mt-0.5 flex-shrink-0">
          {task.status === "completed" ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3
                className={`font-medium text-sm truncate ${
                  task.status === "completed" ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </h3>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityBadge[task.priority]}`}>
                {task.priority}
              </span>
            </div>
            {task.source !== 'Manual' && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/50">
                {sourceIcons[task.source]}
                {task.source}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{task.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {task.owner}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-xs"
            >
              Edit
            </button>
          )}
          <button
            title="Delete task"
            onClick={() => deleteTask(task._id)}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
