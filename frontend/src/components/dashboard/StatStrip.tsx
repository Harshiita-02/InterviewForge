import type { DashboardStats } from "../../types/dashboard";

export default function StatStrip({ stats }: { stats: DashboardStats }) {
  const items = [
    { label: "Total interviews", value: String(stats.totalInterviews) },
    { label: "Completed", value: String(stats.completedInterviews) },
    { label: "Avg. score", value: `${stats.averageScore}%` },
    { label: "Best score", value: `${stats.bestScore}%` },
  ];

  return (
    <div className="grid grid-cols-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={"px-[18px] py-4 " + (i > 0 ? "border-l border-[var(--border)]" : "")}
        >
          <p className="text-[26px] font-medium leading-tight">{item.value}</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{item.label}</p>
        </div>
      ))}
    </div>
  );
}