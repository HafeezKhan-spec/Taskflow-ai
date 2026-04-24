export type Priority = "Low" | "Medium" | "High";
export type Status = "pending" | "completed";
export type Source = "Manual" | "Outlook" | "Salesforce" | "Monday";

export interface Task {
  _id: string;
  title: string;
  description: string;
  owner: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  source: Source;
}

export const owners: string[] = [];

export const initialTasks: Task[] = [];
