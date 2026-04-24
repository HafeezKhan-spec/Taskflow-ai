import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, User, CheckCircle2, Circle } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import AppLayout from "@/components/AppLayout";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

const CalendarPage = () => {
  const { tasks, toggleStatus, deleteTask } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getTasksForDate = (date: Date) =>
    tasks.filter((t) => isSameDay(new Date(t.dueDate), date));

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const priorityBadge = {
    Low: "bg-info/10 text-info",
    Medium: "bg-warning/10 text-warning",
    High: "bg-destructive/10 text-destructive",
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold min-w-[140px] text-center">{format(currentMonth, "MMMM yyyy")}</span>
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="glass-card overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="p-3 text-xs font-medium text-muted-foreground text-center">{d}</div>
            ))}
          </div>
          {/* Days */}
          <div className="grid grid-cols-7">
            {days.map((d, i) => {
              const dayTasks = getTasksForDate(d);
              const inMonth = isSameMonth(d, currentMonth);
              return (
                <div
                  key={i}
                  onClick={() => setSelectedDate(d)}
                  className={`min-h-[100px] p-2 border-b border-r border-border transition-colors cursor-pointer ${
                    !inMonth ? "opacity-30" : ""
                  } ${isToday(d) ? "bg-primary/5" : "hover:bg-secondary/30"}`}
                >
                  <span className={`text-xs font-medium ${isToday(d) ? "text-primary" : "text-muted-foreground"}`}>
                    {format(d, "d")}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t._id}
                        className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                          t.status === "completed"
                            ? "bg-success/10 text-success"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-[10px] text-muted-foreground px-1">+{dayTasks.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Tasks Overlay */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm"
            onClick={() => setSelectedDate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-md p-6 relative z-10 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">{format(selectedDate, "MMMM d, yyyy")}</h2>
                  <p className="text-sm text-muted-foreground">{selectedDateTasks.length} tasks scheduled</p>
                </div>
                <button
                  aria-label="Close"
                  title="Close"
                  onClick={() => setSelectedDate(null)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {selectedDateTasks.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <CalendarIcon className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p>No tasks for this day</p>
                  </div>
                ) : (
                  selectedDateTasks.map((task) => (
                    <div key={task._id} className="p-4 rounded-xl bg-secondary/30 border border-border/50 group">
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => toggleStatus(task._id)} 
                          className="mt-1 flex-shrink-0"
                        >
                          {task.status === "completed" ? (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-sm truncate ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${priorityBadge[task.priority]}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {task.description || "No description provided."}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {task.owner}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setSelectedDate(null)}
                className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default CalendarPage;
