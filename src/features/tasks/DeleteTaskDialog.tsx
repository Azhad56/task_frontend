import { Button } from "../../components/ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog.tsx";
import type { Task } from "../../types/task.ts";

type DeleteTaskDialogProps = {
  task: Task | null;
  deleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeleteTaskDialog({ task, deleting, onOpenChange, onConfirm }: DeleteTaskDialogProps) {
  return (
    <Dialog open={Boolean(task)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete task</DialogTitle>
          <DialogDescription>
            {task ? `"${task.title}" will be permanently deleted.` : "This task will be permanently deleted."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
