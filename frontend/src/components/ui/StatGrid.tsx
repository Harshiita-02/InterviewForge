export interface StatItem {
  label: string;
  value: string;
  valueClass?: string;
}

export default function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <div
      className="grid rounded-xl border border-[var(--border)] bg-[var(--surface)]"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={"px-[18px] py-4 " + (i > 0 ? "border-l border-[var(--border)]" : "")}
        >
          <p className={"text-2xl font-medium leading-tight " + (item.valueClass ?? "")}>
            {item.value}
          </p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{item.label}</p>
        </div>
      ))}
    </div>
  );
}