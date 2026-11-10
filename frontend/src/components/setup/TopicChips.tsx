interface TopicChipsProps {
  topics: string[];
  selected: string[];
  onToggle: (topic: string) => void;
  otherOn: boolean;
  otherText: string;
  onOtherToggle: () => void;
  onOtherChange: (text: string) => void;
}

const chipClass = (on: boolean) =>
  "h-[30px] rounded-full border px-3 text-xs " +
  (on
    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
    : "border-[var(--border)] text-[var(--muted)]");

export default function TopicChips(props: TopicChipsProps) {
  const { topics, selected, onToggle, otherOn, otherText, onOtherToggle, onOtherChange } = props;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            aria-pressed={selected.includes(topic)}
            onClick={() => onToggle(topic)}
            className={chipClass(selected.includes(topic))}
          >
            {topic}
          </button>
        ))}
        <button type="button" aria-pressed={otherOn} onClick={onOtherToggle} className={chipClass(otherOn)}>
          Other
        </button>
      </div>

      {otherOn && (
        <input
          type="text"
          value={otherText}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="Type a topic"
          className="mt-2.5 h-[38px] w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-[13px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
        />
      )}
    </div>
  );
}