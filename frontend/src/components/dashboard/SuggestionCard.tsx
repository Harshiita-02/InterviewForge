import type { SuggestedInterview } from "../../types/dashboard";

interface Props {
  suggestion: SuggestedInterview;
  onStart: () => void;
}

export default function SuggestionCard({ suggestion, onStart }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-[18px] py-4">
      <div>
        <p className="text-sm font-medium">
          {suggestion.topic}, {suggestion.difficulty}
        </p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{suggestion.reason}</p>
      </div>
      <button
        onClick={onStart}
        className="h-[34px] shrink-0 rounded-lg border border-[var(--accent)] px-4 text-[13px] font-medium text-[var(--accent)]"
      >
        Start
      </button>
    </div>
  );
}