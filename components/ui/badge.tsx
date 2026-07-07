import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "adopt" | "trial" | "assess" | "hold" | "risk-low" | "risk-medium" | "risk-high";

const variants: Record<BadgeVariant, string> = {
  default: "border-border bg-muted text-foreground",
  adopt: "border-emerald-200 bg-emerald-50 text-emerald-800",
  trial: "border-sky-200 bg-sky-50 text-sky-800",
  assess: "border-amber-200 bg-amber-50 text-amber-900",
  hold: "border-rose-200 bg-rose-50 text-rose-800",
  "risk-low": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "risk-medium": "border-amber-200 bg-amber-50 text-amber-900",
  "risk-high": "border-rose-200 bg-rose-50 text-rose-800"
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-md border px-2 py-0.5 text-xs font-medium leading-5",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
