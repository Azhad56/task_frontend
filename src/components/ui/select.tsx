import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils.ts";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
        className,
      )}
      {...props}
    />
  );
}
