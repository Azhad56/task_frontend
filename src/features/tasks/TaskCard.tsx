import { Calendar, Pencil, Trash2 } from "lucide-react";
import { Badge } from "../../components/ui/badge.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Select } from "../../components/ui/select.tsx";
import { formatDateOnly } from "../../lib/dates.ts";
import { priorityLabels, statusLabels, TASK_STATUSES, type Task, type TaskPriority, type TaskStatus } from "../../types/task.ts";

const statusTone = {
  todo: "slate",
  in_progress: "amber",
  completed: "emerald",
} as const;

const priorityTone = {
  low: "sky",
  medium: "violet",
  high: "rose",
} as const;

type TaskCardProps = {
  task: Task;
  statusPending: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
};

export function TaskCard({ task, statusPending, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold break-words text-slate-900">{task.title}</h2>
          {task.description ? <p className="mt-1 text-sm break-words text-slate-600">{task.description}</p> : null}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button size="icon" variant="ghost" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={statusTone[task.status]}>{statusLabels[task.status]}</Badge>
          <Badge tone={priorityTone[task.priority as TaskPriority]}>{priorityLabels[task.priority]}</Badge>
          <span className="inline-flex items-center gap-1 text-sm text-slate-500">
            <Calendar aria-hidden="true" className="h-4 w-4" />
            {formatDateOnly(task.dueDate)}
          </span>
        </div>
        <div className="sm:ml-auto sm:w-44">
          <label className="sr-only" htmlFor={`status-${task.id}`}>
            Change status for {task.title}
          </label>
          <Select
            id={`status-${task.id}`}
            aria-label={`Change status for ${task.title}`}
            value={task.status}
            disabled={statusPending}
            onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </article>
  );
}
