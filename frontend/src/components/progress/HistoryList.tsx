import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { InterviewType } from "../../types/interview";
import type { HistoryItem } from "../../types/progress";
import SegmentedControl from "../ui/SegmentedControl";
import Section from "../ui/Section";
import { formatSessionDate, scoreTextClass } from "../../utils/dashboard";

type Filter = "All" | InterviewType;
const FILTERS: Filter[] = ["All", "Technical", "HR"];
const PAGE_SIZE = 5;

export default function HistoryList({ items }: { items: HistoryItem[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = filter === "All" ? items : items.filter((i) => i.type === filter);
  const shown = filtered.slice(0, visible);

  const changeFilter = (f: Filter) => {
    setFilter(f);
    setVisible(PAGE_SIZE);
  };

  return (
    <Section
      title="All interviews"
      action={<SegmentedControl compact options={FILTERS} value={filter} onChange={changeFilter} />}
    >
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        {shown.length === 0 ? (
          <p className="px-[18px] py-4 text-sm text-[var(--muted)]">
            {filter === "All"
              ? "No interviews yet. Start one from the Dashboard."
              : `No ${filter} interviews yet.`}
          </p>
        ) : (
          shown.map((item, i) => (
            <Link
              key={item.id}
              to={`/results/${item.id}`}
              className={
                "flex items-center gap-3 px-[18px] py-3 hover:bg-[var(--bg)] " +
                (i > 0 ? "border-t border-[var(--border)]" : "")
              }
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium">{item.title}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {formatSessionDate(item.completedAt)}, {item.difficulty}
                </p>
              </div>
              <span className={"text-sm font-medium " + scoreTextClass(item.score)}>{item.score}%</span>
              <ChevronRight size={16} className="shrink-0 text-[var(--muted)]" />
            </Link>
          ))
        )}

        {filtered.length > visible && (
          <div className="border-t border-[var(--border)] p-2.5 text-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="text-[13px] font-medium text-[var(--accent)]"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}