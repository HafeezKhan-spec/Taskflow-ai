import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Task } from "@/lib/mockData";
import { toast } from "sonner";

export interface Owner {
  _id: string;
  name: string;
  email: string;
}

export interface Notification {
  _id: string;
  owner: string;
  subject: string;
  type: 'Morning' | 'Evening' | 'Task Completed';
  sentAt: string;
}

interface TaskContextType {
  tasks: Task[];
  owners: Owner[];
  notifications: Notification[];
  currentOwner: Owner | null;
  setCurrentOwner: (owner: Owner | null) => void;
  addTask: (task: Omit<Task, "_id">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  addOwner: (owner: Omit<Owner, "_id">) => Promise<void>;
  deleteOwner: (id: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  loading: boolean;
}

const API_URL = "http://localhost:5000/api";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentOwner, setCurrentOwnerState] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!currentOwner) return;
    try {
      const response = await fetch(`${API_URL}/notifications?owner=${currentOwner.email}`);
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [currentOwner]);

  const setCurrentOwner = useCallback((owner: Owner | null) => {
    setCurrentOwnerState(owner);
    if (owner) {
      localStorage.setItem("currentOwnerId", owner._id);
    } else {
      localStorage.removeItem("currentOwnerId");
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksRes, ownersRes] = await Promise.all([
        fetch(`${API_URL}/tasks`),
        fetch(`${API_URL}/owners`)
      ]);
      
      const tasksData = await tasksRes.json();
      const ownersData = await ownersRes.json();
      
      if (tasksData.success) setTasks(tasksData.data);
      if (ownersData.success) {
        setOwners(ownersData.data);
        // Load current owner from localStorage
        const savedId = localStorage.getItem("currentOwnerId");
        if (savedId) {
          const owner = (ownersData.data as Owner[]).find((o) => o._id === savedId);
          if (owner) {
            setCurrentOwnerState(owner);
          }
        } else if (ownersData.data.length > 0) {
          // Default to first owner if none saved
          setCurrentOwnerState(ownersData.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (currentOwner) {
      fetchNotifications();
    }
  }, [currentOwner, fetchNotifications]);

  const addTask = useCallback(async (task: Omit<Task, "_id">) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      const data = await response.json();
      if (data.success) {
        setTasks((prev) => [data.data, ...prev]);
        toast.success("Task created successfully");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success) {
        setTasks((prev) => prev.map((t) => (t._id === id ? data.data : t)));
        toast.success("Task updated");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        toast.success("Task deleted");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  }, []);

  const toggleStatus = useCallback(async (id: string) => {
    const task = tasks.find(t => t._id === id);
    if (!task) return;

    const newStatus = task.status === "pending" ? "completed" : "pending";
    
    try {
      let response;
      if (newStatus === "completed") {
        response = await fetch(`${API_URL}/tasks/${id}/complete`, {
          method: "PATCH",
        });
      } else {
        response = await fetch(`${API_URL}/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "pending" }),
        });
      }

      const data = await response.json();
      if (data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? data.data : t))
        );
        toast.success("Status updated");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  }, [tasks]);

  const addOwner = useCallback(async (owner: Omit<Owner, "_id">) => {
    try {
      const response = await fetch(`${API_URL}/owners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(owner),
      });
      const data = await response.json();
      if (data.success) {
        setOwners((prev) => [...prev, data.data]);
        toast.success("Owner added successfully");
      }
    } catch (error) {
      console.error("Error adding owner:", error);
      toast.error("Failed to add owner");
    }
  }, []);

  const deleteOwner = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/owners/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setOwners((prev) => prev.filter((o) => o._id !== id));
        toast.success("Owner removed");
      }
    } catch (error) {
      console.error("Error deleting owner:", error);
      toast.error("Failed to remove owner");
    }
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, owners, notifications, currentOwner, setCurrentOwner, addTask, updateTask, deleteTask, toggleStatus, addOwner, deleteOwner, fetchNotifications, loading }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};
