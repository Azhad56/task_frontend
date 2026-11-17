import { z } from "zod";
import { isRealDateOnly } from "../../lib/dates.ts";
import { TASK_PRIORITIES, TASK_STATUSES } from "../../types/task.ts";

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Title is required" })
    .max(120, { error: "Title must be 120 characters or fewer" }),
  description: z
    .string()
    .trim()
    .max(1000, { error: "Description must be 1000 characters or fewer" }),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z.string().refine((value) => value === "" || isRealDateOnly(value), {
    error: "Enter a valid due date",
  }),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const emptyTaskForm: TaskFormValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};
