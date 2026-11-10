import type { TopicScore } from "../../types/progress";
import Section from "../ui/Section";
import { LOW_SCORE_THRESHOLD } from "../../utils/dashboard";

export default function TopicScores({ topics }: { topics: TopicScore[] }) {
  const sorted = [...topics].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const valueClass = (t: TopicScore) => {
    if (t === strongest && t.score >= LOW_SCORE_THRESHOLD) return "text-[var(--good)]";
    if (t === weakest && t.score < LOW_SCORE_THRESHOLD) return "text-[var(--bad)]";
    return "";
  };

  return (
    <Section
      title="Topic scores"
      action={<span className="text-xs text-[var(--muted)]">All interviews</span>}
    >
      <div className="flex flex-col gap-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
        {sorted.length === 0 ? (
          <p className="text-[13px] text-[var(--muted)]">Topic scores appear after your first interview.</p>
        ) : (
          sorted.map((t) => (
            <div key={t.topic} className="grid grid-cols-[84px_1fr_30px] items-center gap-2.5 text-xs">
              <span>{t.topic}</span>
              <div className="h-2 overflow-hidden rounded bg-[var(--bg)]">
                <div className="h-2 rounded bg-[var(--accent)]" style={{ width: `${t.score}%` }} />
              </div>
              <span className={"text-right " + valueClass(t)}>{t.score}</span>
            </div>
          ))
        )}
      </div>
    </Section>
  );
}