import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TaskDashboard } from "./TaskDashboard.tsx";

type StoredTask = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

function summaryFor(tasks: StoredTask[]) {
  return {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "todo").length,
    in_progress: tasks.filter((task) => task.status === "in_progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };
}

function renderDashboard() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Harness() {
    const [queryClient] = useState(() => client);
    return (
      <QueryClientProvider client={queryClient}>
        <TaskDashboard />
      </QueryClientProvider>
    );
  }

  return render(<Harness />);
}

describe("TaskDashboard", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates a task and shows it without a manual refresh", async () => {
    const user = userEvent.setup();
    const tasks: StoredTask[] = [];

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";

        if (url.includes("/api/tasks") && method === "POST") {
          const body = JSON.parse(String(init?.body)) as Omit<StoredTask, "id" | "createdAt" | "updatedAt">;
          const task: StoredTask = {
            ...body,
            id: "665f1f77bcf86cd799439011",
            createdAt: "2026-11-17T00:00:00.000Z",
            updatedAt: "2026-11-17T00:00:00.000Z",
          };
          tasks.push(task);
          return Response.json({ success: true, data: task }, { status: 201 });
        }

        if (url.includes("/api/tasks") && method === "GET") {
          return Response.json({ success: true, data: { tasks, summary: summaryFor(tasks) } });
        }

        return Response.json({ success: false, error: { message: "Not found" } }, { status: 404 });
      }),
    );

    renderDashboard();

    expect(await screen.findByText("No tasks yet")).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "New task" })[0]);
    await user.type(screen.getByLabelText("Title"), "Ship the dashboard");
    await user.click(screen.getByRole("button", { name: "Create task" }));

    expect(await screen.findByRole("heading", { name: "Ship the dashboard" })).toBeInTheDocument();
    expect(screen.queryByText("No tasks yet")).not.toBeInTheDocument();
  });

  it("changes a task status from the card", async () => {
    const user = userEvent.setup();
    const tasks: StoredTask[] = [
      {
        id: "665f1f77bcf86cd799439012",
        title: "Review pull request",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: null,
        createdAt: "2026-11-17T00:00:00.000Z",
        updatedAt: "2026-11-17T00:00:00.000Z",
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        const method = init?.method ?? "GET";

        if (method === "PATCH") {
          const body = JSON.parse(String(init?.body)) as { status: StoredTask["status"] };
          tasks[0] = { ...tasks[0], status: body.status, updatedAt: "2026-11-17T01:00:00.000Z" };
          return Response.json({ success: true, data: tasks[0] });
        }

        if (method === "GET") {
          return Response.json({ success: true, data: { tasks, summary: summaryFor(tasks) } });
        }

        return Response.json({ success: false, error: { message: "Not found" } }, { status: 404 });
      }),
    );

    renderDashboard();

    const status = await screen.findByLabelText("Change status for Review pull request");
    await user.selectOptions(status, "completed");

    await waitFor(() => {
      expect(screen.getByLabelText("Change status for Review pull request")).toHaveValue("completed");
    });
  });

  it("shows an error state with retry when loading fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ success: false, error: { message: "Database unavailable" } }, { status: 500 }),
      ),
    );

    renderDashboard();

    expect(await screen.findByRole("alert")).toHaveTextContent("Database unavailable");
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});
