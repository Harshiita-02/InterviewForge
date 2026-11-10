interface Props {
  text: string;
  isFollowUp: boolean;
}

export default function QuestionCard({ text, isFollowUp }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[22px]">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-xs text-[var(--muted)]">Question</span>
        {isFollowUp && (
          <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]">
            Follow-up
          </span>
        )}
      </div>
      <p className="text-lg font-medium leading-normal">{text}</p>
    </div>
  );
}