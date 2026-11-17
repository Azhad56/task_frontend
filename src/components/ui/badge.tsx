import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils.ts";

const tones = {
  slate: "bg-slate-100 text-slate-700",
  amber: "bg-amber-100 text-amber-800",
  emerald: "bg-emerald-100 text-emerald-800",
  sky: "bg-sky-100 text-sky-800",
  violet: "bg-violet-100 text-violet-800",
  rose: "bg-rose-100 text-rose-800",
} as const;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: keyof typeof tones;
};

export function Badge({ className, tone = "slate", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
