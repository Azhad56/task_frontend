import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTask, deleteTask, getTasks, updateTask } from "../lib/api.ts";
import type { TaskFilters, TaskInput, TaskStatus } from "../types/task.ts";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useTaskList(filters: TaskFilters) {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => getTasks(filters),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskInput) => createTask(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not create the task"));
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TaskInput> }) => updateTask(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not update the task"));
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not delete the task"));
    },
  });
}

export function useStatusChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => updateTask(id, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Status updated");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Could not update the status"));
    },
  });
}
