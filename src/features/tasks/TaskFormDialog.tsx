import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Label } from "../../components/ui/label.tsx";
import { Select } from "../../components/ui/select.tsx";
import { Textarea } from "../../components/ui/textarea.tsx";
import { toDateInputValue } from "../../lib/dates.ts";
import { priorityLabels, statusLabels, TASK_PRIORITIES, TASK_STATUSES, type Task, type TaskInput } from "../../types/task.ts";
import { emptyTaskForm, taskFormSchema, type TaskFormValues } from "./taskFormSchema.ts";

type TaskFormDialogProps = {
  open: boolean;
  task: Task | null;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: TaskInput) => void;
};

export function TaskFormDialog({ open, task, submitting, onOpenChange, onSubmit }: TaskFormDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: emptyTaskForm,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(
      task
        ? {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: toDateInputValue(task.dueDate),
          }
        : emptyTaskForm,
    );
  }, [form, open, task]);

  const errors = form.formState.errors;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {task ? "Update the details and save your changes." : "Add a task with a title, priority, and optional due date."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            onSubmit({
              title: values.title,
              description: values.description,
              status: values.status,
              priority: values.priority,
              dueDate: values.dueDate ? values.dueDate : null,
            });
          })}
        >
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input id="task-title" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "task-title-error" : undefined} {...form.register("title")} />
            {errors.title ? (
              <p id="task-title-error" className="text-sm text-red-700">
                {errors.title.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea id="task-description" aria-invalid={Boolean(errors.description)} {...form.register("description")} />
            {errors.description ? <p className="text-sm text-red-700">{errors.description.message}</p> : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-status">Status</Label>
              <Select id="task-status" {...form.register("status")}>
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select id="task-priority" {...form.register("priority")}>
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priorityLabels[priority]}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-due-date">Due date</Label>
            <Input id="task-due-date" type="date" {...form.register("dueDate")} />
            {errors.dueDate ? <p className="text-sm text-red-700">{errors.dueDate.message}</p> : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : task ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
