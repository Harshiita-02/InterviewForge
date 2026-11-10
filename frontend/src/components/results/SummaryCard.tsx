import { ArrowUpRight, Check, type LucideIcon } from "lucide-react";

interface BulletListProps {
  title: string;
  items: string[];
  icon: LucideIcon;
}

function BulletList({ title, items, icon: Icon }: BulletListProps) {
  return (
    <div>
      <h3 className="mb-2 text-[13px] font-medium">{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-normal">
            <Icon size={14} className="mt-0.5 shrink-0 text-[var(--accent)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SummaryCardProps {
  summary: string;
  strengths: string[];
  improvements: string[];
}

export default function SummaryCard({ summary, strengths, improvements }: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
      <p className="text-[13px] leading-relaxed">{summary}</p>
      <div className="grid grid-cols-2 gap-5 border-t border-[var(--border)] pt-4">
        <BulletList title="Strengths" items={strengths} icon={Check} />
        <BulletList title="To improve" items={improvements} icon={ArrowUpRight} />
      </div>
    </div>
  );
}