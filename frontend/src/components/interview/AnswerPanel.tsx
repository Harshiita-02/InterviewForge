import { Mic, Square } from "lucide-react";
import type { AnswerSource } from "../../types/interview";
import SegmentedControl from "../ui/SegmentedControl";
import { useSpeechToText } from "../../hooks/useSpeechToText";

const MODES: AnswerSource[] = ["TYPED", "VOICE"];

const areaClass =
  "w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-sm " +
  "leading-normal text-[var(--text)] outline-none focus:border-[var(--accent)]";

interface Props {
  mode: AnswerSource;
  onModeChange: (mode: AnswerSource) => void;
  answer: string;
  onAnswerChange: (text: string) => void;
  onSubmit: () => void;
  canSubmit: boolean;
  submitting: boolean;
  error: string;
}

export default function AnswerPanel(props: Props) {
  const { mode, onModeChange, answer, onAnswerChange, onSubmit, canSubmit, submitting, error } = props;
  const { listening, supported, error: voiceError, start, stop } = useSpeechToText(onAnswerChange);

  function handleMic() {
    if (listening) {
      stop();
    } else {
      start(answer);
    }
  }

  function handleModeChange(next: AnswerSource) {
    if (listening) stop();
    onModeChange(next);
  }

  const micLabel = listening
    ? "Listening… tap to stop"
    : supported
      ? "Tap to start speaking"
      : "Voice isn't supported in this browser";

  const shownError = error || voiceError;

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <SegmentedControl
        compact
        options={MODES}
        value={mode}
        onChange={handleModeChange}
        getLabel={(m) => (m === "TYPED" ? "Type" : "Voice")}
      />

      {mode === "TYPED" ? (
        <textarea
          rows={6}
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type your answer here…"
          className={areaClass}
        />
      ) : (
        <div>
          <div className="flex flex-col items-center gap-2 pb-3.5 pt-2">
            <button
              type="button"
              onClick={handleMic}
              disabled={!supported}
              aria-label={listening ? "Stop listening" : "Start listening"}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white disabled:opacity-50"
            >
              {listening ? <Square size={22} fill="currentColor" /> : <Mic size={24} />}
            </button>
            <span className="text-xs text-[var(--muted)]">{micLabel}</span>
          </div>
          <p className="mb-1.5 text-xs text-[var(--muted)]">Transcript</p>
          <textarea
            rows={4}
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Your transcript will appear here. You can edit it before submitting."
            className={areaClass}
          />
        </div>
      )}

      {shownError && <p className="text-[13px] text-[var(--bad)]">{shownError}</p>}

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-[var(--muted)]">
          Your answer is submitted automatically when the timer ends.
        </span>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || listening}
          className="h-[38px] shrink-0 rounded-lg bg-[var(--accent)] px-[18px] text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit answer"}
        </button>
      </div>
    </div>
  );
}