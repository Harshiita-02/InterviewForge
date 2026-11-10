import type { InterviewResult } from "../../types/results";
import { scoreTextClass } from "../../utils/dashboard";

export default function ScoreStrip({ result }: { result: InterviewResult }) {
  const items = [
    { label: "Answered", value: `${result.answeredCount} of ${result.totalQuestions}` },
    { label: "Time taken", value: `${result.durationMinutes} min` },
    { label: "Final difficulty", value: result.finalDifficulty },
  ];

  return (
    <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="px-[18px] py-4">
        <p className={"text-[30px] font-medium leading-tight " + scoreTextClass(result.overallScore)}>
          {result.overallScore}%
        </p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">Overall score</p>
      </div>
      {items.map((item) => (
        <div key={item.label} className="border-l border-[var(--border)] px-[18px] py-4">
          <p className="text-xl font-medium leading-normal">{item.value}</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{item.label}</p>
        </div>
      ))}
    </div>
  );
}