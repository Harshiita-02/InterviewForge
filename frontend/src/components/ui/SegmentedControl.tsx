interface SegmentedControlProps<T extends string> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel?: (option: T) => string;
  compact?: boolean;
}

export default function SegmentedControl<T extends string>({
  options, value, onChange, getLabel, compact = false,
}: SegmentedControlProps<T>) {
  return (
    <div className={"overflow-hidden rounded-lg border border-[var(--border)] " + (compact ? "inline-flex" : "flex")}>
      {options.map((option, i) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={
              (compact ? "h-[30px] px-3.5 text-xs " : "h-9 flex-1 text-[13px] ") +
              (i > 0 ? "border-l border-[var(--border)] " : "") +
              (active
                ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                : "text-[var(--muted)]")
            }
          >
            {getLabel ? getLabel(option) : option}
          </button>
        );
      })}
    </div>
  );
}