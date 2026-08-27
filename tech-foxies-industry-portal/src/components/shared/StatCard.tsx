import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "teal" | "amber" | "blue" | "green";
}

const ACCENTS: Record<string, string> = {
  teal: "bg-teal-50 text-teal-700",
  amber: "bg-amber-100 text-amber-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
};

export default function StatCard({ label, value, icon: Icon, accent = "teal" }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-ink-100 bg-surface p-4 shadow-sm">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded", ACCENTS[accent])}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold leading-tight text-ink-900">{value}</p>
        <p className="truncate text-xs font-medium text-ink-500">{label}</p>
      </div>
    </div>
  );
}
