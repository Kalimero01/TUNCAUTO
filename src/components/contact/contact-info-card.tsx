import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ContactInfoCardProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function ContactInfoCard({ label, children, className }: ContactInfoCardProps) {
  return (
    <div
      className={cn(
        "group rounded-sm border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-sm transition-colors hover:border-zinc-700/90 hover:bg-zinc-950/80",
        className
      )}
    >
      <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">{label}</h2>
      <div className="mt-3 text-zinc-300">{children}</div>
    </div>
  );
}
