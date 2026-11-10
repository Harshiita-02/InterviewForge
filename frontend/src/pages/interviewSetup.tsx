import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Difficulty, InterviewType, SetupOptions } from "../types/interview";
import { createSession, getSetupOptions } from "../services/interviewService";
import Field, { controlClass } from "../components/ui/Field";
import SegmentedControl from "../components/ui/SegmentedControl";
import TopicChips from "../components/setup/TopicChips";

const TYPES: InterviewType[] = ["Technical", "HR"];
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

interface SetupForm {
  role: string;
  type: InterviewType;
  difficulty: Difficulty;
  topics: string[];
  useOther: boolean;
  otherTopic: string;
  resumeId: number | null;
  companyId: number | null;
}

const initialForm: SetupForm = {
  role: "", type: "Technical", difficulty: "Medium",
  topics: [], useOther: false, otherTopic: "",
  resumeId: null, companyId: null,
};

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [options, setOptions] = useState<SetupOptions | null>(null);
  const [form, setForm] = useState<SetupForm>(initialForm);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSetupOptions()
      .then((opts) => {
        setOptions(opts);
        setForm((f) => ({ ...f, role: opts.roles[0] }));
      })
      .catch(() => setError("Couldn't load the setup options. Please refresh."));
  }, []);

  if (!options) {
    return error
      ? <p className="text-sm text-[var(--bad)]">{error}</p>
      : <p className="text-sm text-[var(--muted)]">Loading…</p>;
  }

  const update = <K extends keyof SetupForm>(key: K, value: SetupForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleTopic = (topic: string) =>
    setForm((f) => ({
      ...f,
      topics: f.topics.includes(topic)
        ? f.topics.filter((t) => t !== topic)
        : [...f.topics, topic],
    }));

  const handleCompanyChange = (value: string) => {
    const id = value ? Number(value) : null;
    const company = options.companies.find((c) => c.id === id);
    setForm((f) => ({ ...f, companyId: id, topics: company ? company.topics : f.topics }));
  };

  const otherTopic = form.useOther ? form.otherTopic.trim() : "";
  const finalTopics = otherTopic ? [...form.topics, otherTopic] : form.topics;
  const canStart = finalTopics.length > 0 && !starting;
  const topicLabel =
    finalTopics.length === 0
      ? "no topics selected"
      : `${finalTopics.length} ${finalTopics.length === 1 ? "topic" : "topics"}`;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canStart) return;
    setError("");
    setStarting(true);
    try {
      const { sessionId } = await createSession({
        role: form.role,
        type: form.type,
        difficulty: form.difficulty,
        topics: finalTopics,
        resumeId: form.resumeId,
        companyTemplateId: form.companyId,
      });
      navigate(`/interview/${sessionId}`);
    } catch {
      setError("Couldn't start the interview. Please try again.");
    } finally {
      setStarting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-5">
      <div>
        <h1 className="text-[21px] font-medium">New interview</h1>
        <p className="mt-1 text-[13px] text-[var(--muted)]">Choose what you want to practice.</p>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <Field label="Role" htmlFor="role">
          <select id="role" className={controlClass} value={form.role}
                  onChange={(e) => update("role", e.target.value)}>
            {options.roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>

        <div className="grid grid-cols-[1fr_1.3fr] gap-3.5">
          <Field label="Interview type">
            <SegmentedControl options={TYPES} value={form.type} onChange={(v) => update("type", v)} />
          </Field>
          <Field label="Difficulty">
            <SegmentedControl options={DIFFICULTIES} value={form.difficulty} onChange={(v) => update("difficulty", v)} />
          </Field>
        </div>
        <p className="-mt-3 text-xs text-[var(--muted)]">The timer per question adjusts with difficulty.</p>

        <Field label="Topics" hint="Pick one or more">
          <TopicChips
            topics={options.topics}
            selected={form.topics}
            onToggle={toggleTopic}
            otherOn={form.useOther}
            otherText={form.otherTopic}
            onOtherToggle={() => update("useOther", !form.useOther)}
            onOtherChange={(t) => update("otherTopic", t)}
          />
        </Field>

        <div className="border-t border-[var(--border)] pt-[18px]">
          <p className="mb-2.5 text-xs text-[var(--muted)]">Optional</p>
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Resume" htmlFor="resume">
              <select id="resume" className={controlClass} value={form.resumeId ?? ""}
                      onChange={(e) => update("resumeId", e.target.value ? Number(e.target.value) : null)}>
                <option value="">None</option>
                {options.resumes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </Field>
            <Field label="Company mode" htmlFor="company">
              <select id="company" className={controlClass} value={form.companyId ?? ""}
                      onChange={(e) => handleCompanyChange(e.target.value)}>
                <option value="">None</option>
                {options.companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
        </div>
      </div>

      {error && <p className="text-[13px] text-[var(--bad)]">{error}</p>}

      <div className="flex items-center justify-between gap-4">
        <p className="text-[13px] text-[var(--muted)]">
          {form.role}, {form.type}, {form.difficulty}, {topicLabel}
        </p>
        <button
          type="submit"
          disabled={!canStart}
          className="h-[38px] shrink-0 rounded-lg bg-[var(--accent)] px-[18px] text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {starting ? "Starting…" : "Start Interview"}
        </button>
      </div>
    </form>
  );
}