import { Link } from "react-router-dom";
import type { RecentSession } from "../../types/dashboard";
import { LOW_SCORE_THRESHOLD, formatSessionDate } from "../../utils/dashboard";

export default function RecentSessions({ sessions }: { sessions: RecentSession[] }) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-[18px] py-4 text-sm text-[var(--muted)]">
        No sessions yet. Start your first interview.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      {sessions.map((s, i) => (
        <Link
          key={s.id}
          to={`/results/${s.id}`}
          className={
            "flex items-center justify-between gap-4 px-[18px] py-3 hover:bg-[var(--bg)] " +
            (i > 0 ? "border-t border-[var(--border)]" : "")
          }
        >
          <div>
            <p className="text-[13px] font-medium">{s.title}</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">{formatSessionDate(s.completedAt)}</p>
          </div>
          <span
            className={
              "text-sm font-medium " +
              (s.score >= LOW_SCORE_THRESHOLD ? "text-[var(--good)]" : "text-[var(--bad)]")
            }
          >
            {s.score}%
          </span>
        </Link>
      ))}
    </div>
  );
}