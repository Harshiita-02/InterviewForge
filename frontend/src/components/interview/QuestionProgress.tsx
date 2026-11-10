import { Clock } from "lucide-react";
import { formatTime } from "../../utils/interview";

interface Props {
  current: number;
  total: number;
  remaining: number;
}

export default function QuestionProgress({ current, total, remaining }: Props) {
  const percent = Math.round((current / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] text-[var(--muted)]">
          Question {current} of {total}
        </span>
        <span className="flex items-center gap-1.5 text-[13px] font-medium tabular-nums">
          <Clock size={15} className="text-[var(--muted)]" />
          {formatTime(remaining)}
        </span>
      </div>
      <div className="h-1 rounded-full bg-[var(--border)]">
        <div className="h-1 rounded-full bg-[var(--accent)]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}