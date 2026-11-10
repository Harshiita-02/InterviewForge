import ThemeToggle from "../ThemeToggle";

interface Props {
  context: string;
  onEnd: () => void;
}

export default function InterviewHeader({ context, onEnd }: Props) {
  return (
    <header className="flex h-12 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-5">
      <span className="text-sm font-medium">
        Interview<span className="text-[var(--accent)]">Forge</span>
      </span>
      <span className="hidden text-xs text-[var(--muted)] sm:block">{context}</span>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={onEnd}
          className="h-[30px] rounded-lg border border-[var(--border)] px-3 text-xs text-[var(--muted)]"
        >
          End interview
        </button>
      </div>
    </header>
  );
}