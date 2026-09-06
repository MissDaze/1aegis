import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 font-mono text-2xs uppercase tracking-label text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
