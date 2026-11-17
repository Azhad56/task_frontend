import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button.tsx";
import { useCreateTask, useDeleteTask, useStatusChange, useTaskList, useUpdateTask } from "../../hooks/useTasks.ts";
import { defaultFilters, type Task, type TaskFilters, type TaskInput, type TaskStatus } from "../../types/task.ts";
import { DeleteTaskDialog } from "./DeleteTaskDialog.tsx";
import { SummaryCards } from "./SummaryCards.tsx";
import { TaskCard } from "./TaskCard.tsx";
import { TaskFilters as TaskFiltersBar } from "./TaskFilters.tsx";
import { TaskFormDialog } from "./TaskFormDialog.tsx";

export function TaskDashboard() {
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const tasksQuery = useTaskList(filters);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const statusChange = useStatusChange();

  const filtersActive = Boolean(filters.search.trim() || filters.status || filters.priority);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleSubmit(input: TaskInput) {
    if (editing) {
      updateTask.mutate(
        { id: editing.id, input },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditing(null);
          },
        },
      );
      return;
    }

    createTask.mutate(input, {
      onSuccess: () => {
        setFormOpen(false);
      },
    });
  }

  function handleStatusChange(task: Task, status: TaskStatus) {
    if (status === task.status) {
      return;
    }
    statusChange.mutate({ id: task.id, status });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-500">TaskFlow</p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Tasks</h1>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New task
          </Button>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6">
        <SummaryCards summary={tasksQuery.data?.summary} loading={tasksQuery.isLoading} />
        <TaskFiltersBar filters={filters} onChange={setFilters} />
        {tasksQuery.isLoading ? (
          <div aria-busy="true" aria-live="polite" className="space-y-3">
            <span className="sr-only">Loading tasks</span>
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : null}
        {tasksQuery.isError ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-base font-semibold text-red-900">Could not load tasks</h2>
            <p className="mt-1 text-sm text-red-800">
              {tasksQuery.error instanceof Error ? tasksQuery.error.message : "Something went wrong."}
            </p>
            <Button className="mt-4" variant="outline" onClick={() => void tasksQuery.refetch()}>
              Try again
            </Button>
          </div>
        ) : null}
        {tasksQuery.isSuccess && tasksQuery.data.tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              {filtersActive ? "No matching tasks" : "No tasks yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              {filtersActive
                ? "Try a different title, status, or priority."
                : "Create a task to start tracking work."}
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
              {filtersActive ? (
                <Button variant="outline" onClick={() => setFilters(defaultFilters)}>
                  Clear filters
                </Button>
              ) : null}
              <Button onClick={openCreate}>New task</Button>
            </div>
          </div>
        ) : null}
        {tasksQuery.isSuccess && tasksQuery.data.tasks.length > 0 ? (
          <section aria-label="Task list" className="space-y-3">
            {tasksQuery.data.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                statusPending={statusChange.isPending && statusChange.variables?.id === task.id}
                onEdit={(selected) => {
                  setEditing(selected);
                  setFormOpen(true);
                }}
                onDelete={setDeleting}
                onStatusChange={handleStatusChange}
              />
            ))}
          </section>
        ) : null}
      </main>
      <TaskFormDialog
        open={formOpen}
        task={editing}
        submitting={createTask.isPending || updateTask.isPending}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditing(null);
          }
        }}
        onSubmit={handleSubmit}
      />
      <DeleteTaskDialog
        task={deleting}
        deleting={deleteTask.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
        onConfirm={() => {
          if (!deleting) {
            return;
          }
          deleteTask.mutate(deleting.id, {
            onSuccess: () => setDeleting(null),
          });
        }}
      />
    </div>
  );
}
