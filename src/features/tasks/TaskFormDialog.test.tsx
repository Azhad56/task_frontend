import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskFormDialog } from "./TaskFormDialog.tsx";

describe("TaskFormDialog", () => {
  it("shows a validation message and does not submit a blank title", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <TaskFormDialog open task={null} submitting={false} onOpenChange={vi.fn()} onSubmit={onSubmit} />,
    );

    await user.type(screen.getByLabelText("Title"), "   ");
    await user.click(screen.getByRole("button", { name: "Create task" }));

    expect(await screen.findByText("Title is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits trimmed task details", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <TaskFormDialog open task={null} submitting={false} onOpenChange={vi.fn()} onSubmit={onSubmit} />,
    );

    await user.type(screen.getByLabelText("Title"), "  Prepare demo  ");
    await user.selectOptions(screen.getByLabelText("Priority"), "high");
    await user.click(screen.getByRole("button", { name: "Create task" }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Prepare demo",
      description: "",
      status: "todo",
      priority: "high",
      dueDate: null,
    });
  });
});
