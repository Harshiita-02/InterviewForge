import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { QuestionResult } from "../../types/results";
import { scoreTextClass } from "../../utils/dashboard";

export default function QuestionBreakdown({ questions }: { questions: QuestionResult[] }) {
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggle = (id: number) =>
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      {questions.map((q, i) => {
        const open = openIds.includes(q.id);
        return (
          <div key={q.id} className={i > 0 ? "border-t border-[var(--border)]" : ""}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => toggle(q.id)}
              className="flex w-full items-center gap-3 px-[18px] py-3 text-left hover:bg-[var(--bg)]"
            >
              <span className="w-4 shrink-0 text-xs text-[var(--muted)]">{q.number}</span>
              <span className="flex min-w-0 flex-1 items-center gap-1.5 text-[13px] leading-snug">
                <span>{q.question}</span>
                {q.isFollowUp && (
                  <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-[7px] py-px text-[11px] font-medium text-[var(--accent)]">
                    Follow-up
                  </span>
                )}
              </span>
              <span className={"text-sm font-medium " + scoreTextClass(q.score)}>{q.score}%</span>
              {open
                ? <ChevronUp size={16} className="shrink-0 text-[var(--muted)]" />
                : <ChevronDown size={16} className="shrink-0 text-[var(--muted)]" />}
            </button>

            {open && (
              <div className="px-[18px] pb-4">
                <p className="mb-1 text-xs text-[var(--muted)]">Your answer</p>
                <p className="mb-3 text-[13px] leading-relaxed">{q.answer || "No answer submitted."}</p>
                <p className="mb-1 text-xs text-[var(--muted)]">Feedback</p>
                <p className="text-[13px] leading-relaxed text-[var(--muted)]">{q.feedback}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}