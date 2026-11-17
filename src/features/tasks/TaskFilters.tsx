import { Search } from "lucide-react";
import { Input } from "../../components/ui/input.tsx";
import { Label } from "../../components/ui/label.tsx";
import { Select } from "../../components/ui/select.tsx";
import { priorityLabels, statusLabels, TASK_PRIORITIES, TASK_STATUSES, type TaskFilters as Filters } from "../../types/task.ts";

type TaskFiltersProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const sortValue = `${filters.sortBy}:${filters.order}`;

  return (
    <section aria-label="Search and filters" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="task-search">Search</Label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="task-search"
              value={filters.search}
              onChange={(event) => onChange({ ...filters, search: event.target.value })}
              placeholder="Search by title"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            id="status-filter"
            value={filters.status}
            onChange={(event) => onChange({ ...filters, status: event.target.value as Filters["status"] })}
          >
            <option value="">All statuses</option>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority-filter">Priority</Label>
          <Select
            id="priority-filter"
            value={filters.priority}
            onChange={(event) => onChange({ ...filters, priority: event.target.value as Filters["priority"] })}
          >
            <option value="">All priorities</option>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priorityLabels[priority]}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-sort">Sort</Label>
          <Select
            id="task-sort"
            value={sortValue}
            onChange={(event) => {
              const [sortBy, order] = event.target.value.split(":") as [Filters["sortBy"], Filters["order"]];
              onChange({ ...filters, sortBy, order });
            }}
          >
            <option value="createdAt:desc">Newest first</option>
            <option value="createdAt:asc">Oldest first</option>
            <option value="dueDate:asc">Due date, earliest</option>
            <option value="dueDate:desc">Due date, latest</option>
          </Select>
        </div>
      </div>
    </section>
  );
}
