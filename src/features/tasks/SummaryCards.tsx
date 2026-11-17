import { CheckCircle2, CircleDashed, ListTodo, LoaderCircle } from "lucide-react";
import type { TaskSummary } from "../../types/task.ts";

const cards = [
  { key: "total", label: "Total", icon: ListTodo },
  { key: "todo", label: "To Do", icon: CircleDashed },
  { key: "in_progress", label: "In Progress", icon: LoaderCircle },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
] as const;

type SummaryCardsProps = {
  summary?: TaskSummary;
  loading?: boolean;
};

export function SummaryCards({ summary, loading = false }: SummaryCardsProps) {
  return (
    <section aria-label="Task summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">{card.label}</p>
              <Icon aria-hidden="true" className="h-4 w-4 text-slate-400" />
            </div>
            {loading || !summary ? (
              <div className="mt-3 h-8 w-12 animate-pulse rounded bg-slate-200" />
            ) : (
              <p className="mt-2 text-2xl font-semibold tracking-tight">{summary[card.key]}</p>
            )}
          </article>
        );
      })}
    </section>
  );
}
