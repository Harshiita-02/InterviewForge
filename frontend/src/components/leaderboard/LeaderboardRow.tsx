interface Props {
  rank: number;
  name: string;
  interviews: number;
  averageScore: number;
  isYou: boolean;
  isFirstRow: boolean;
}

export default function LeaderboardRow({ rank, name, interviews, averageScore, isYou, isFirstRow }: Props) {
  return (
    <div
      className={
        "flex items-center gap-3 px-[18px] py-[11px] " +
        (isFirstRow ? "" : "border-t border-[var(--border)] ") +
        (isYou ? "bg-[var(--accent-soft)]" : "")
      }
    >
      <span className={"w-[22px] text-[13px] " + (rank <= 3 ? "font-medium text-[var(--accent)]" : "text-[var(--muted)]")}>
        {rank}
      </span>
      <div
        className={
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium " +
          (isYou ? "bg-[var(--surface)] text-[var(--accent)]" : "bg-[var(--bg)] text-[var(--muted)]")
        }
      >
        {name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center text-[13px] font-medium">
          {name}
          {isYou && (
            <span className="ml-2 rounded-full bg-[var(--surface)] px-2 py-px text-[11px] font-medium text-[var(--accent)]">
              You
            </span>
          )}
        </p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{interviews} interviews</p>
      </div>
      <span className="text-sm font-medium">{averageScore}%</span>
    </div>
  );
}