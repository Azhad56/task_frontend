export const TASK_STATUSES = ["todo", "in_progress", "completed"] as const;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type SortField = "createdAt" | "dueDate";
export type SortOrder = "asc" | "desc";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskSummary = {
  total: number;
  todo: number;
  in_progress: number;
  completed: number;
};

export type TaskList = {
  tasks: Task[];
  summary: TaskSummary;
};

export type TaskFilters = {
  search: string;
  status: "" | TaskStatus;
  priority: "" | TaskPriority;
  sortBy: SortField;
  order: SortOrder;
};

export type TaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
};

export const defaultFilters: TaskFilters = {
  search: "",
  status: "",
  priority: "",
  sortBy: "createdAt",
  order: "desc",
};

export const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  completed: "Completed",
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
