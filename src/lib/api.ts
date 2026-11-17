import type { Task, TaskFilters, TaskInput, TaskList } from "../types/task.ts";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type SuccessEnvelope<T> = {
  success: true;
  data: T;
};

type ErrorEnvelope = {
  success: false;
  error?: {
    message?: string;
  };
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your connection and try again.", 0);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = (await response.json().catch(() => null)) as SuccessEnvelope<T> | ErrorEnvelope | null;

  if (!response.ok || !body || body.success !== true) {
    const message =
      body && "error" in body && body.error?.message
        ? body.error.message
        : "Something went wrong. Please try again.";
    throw new ApiError(message, response.status);
  }

  return body.data;
}

export function getTasks(filters: TaskFilters): Promise<TaskList> {
  const params = new URLSearchParams();
  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.priority) {
    params.set("priority", filters.priority);
  }
  params.set("sortBy", filters.sortBy);
  params.set("order", filters.order);

  const query = params.toString();
  return request<TaskList>(`/api/tasks?${query}`);
}

export function createTask(input: TaskInput): Promise<Task> {
  return request<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTask(id: string, input: Partial<TaskInput>): Promise<Task> {
  return request<Task>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTask(id: string): Promise<void> {
  return request<void>(`/api/tasks/${id}`, { method: "DELETE" });
}
