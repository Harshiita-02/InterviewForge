import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Download } from "lucide-react";
import type { InterviewResult } from "../types/results";
import { downloadReport, getResult } from "../services/interviewService";
import { formatCompleted } from "../utils/dashboard";
import { saveBlob } from "../utils/download";
import ScoreStrip from "../components/results/ScoreStrip";
import SummaryCard from "../components/results/SummaryCard";
import QuestionBreakdown from "../components/results/QuestionBreakdown";

export default function Results() {
  const { id } = useParams();
  const sessionId = Number(id);
  const navigate = useNavigate();

  const [result, setResult] = useState<InterviewResult | null>(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getResult(sessionId)
      .then(setResult)
      .catch(() => setError("Couldn't load these results. Please try again."));
  }, [sessionId]);

  async function handleDownload() {
    setError("");
    setDownloading(true);
    try {
      const { blob, filename } = await downloadReport(sessionId);
      saveBlob(blob, filename);
    } catch {
      setError("Couldn't download the report. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  if (!result) {
    return (
      <p className={"text-sm " + (error ? "text-[var(--bad)]" : "text-[var(--muted)]")}>
        {error || "Loading…"}
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[21px] font-medium">Interview results</h1>
          <p className="mt-1 text-[13px] text-[var(--muted)]">
            {result.role}, {result.type}, {result.finalDifficulty}. Completed {formatCompleted(result.completedAt)}.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => navigate("/interview/setup")}
            className="h-9 rounded-lg border border-[var(--border)] px-3.5 text-[13px]"
          >
            New interview
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3.5 text-[13px] font-medium text-white disabled:opacity-60"
          >
            <Download size={15} />
            {downloading ? "Preparing…" : "Download PDF"}
          </button>
        </div>
      </div>

      {error && <p className="-mt-3 text-[13px] text-[var(--bad)]">{error}</p>}

      <ScoreStrip result={result} />

      <section>
        <h2 className="mb-2 text-xs text-[var(--muted)]">Summary</h2>
        <SummaryCard
          summary={result.summary}
          strengths={result.strengths}
          improvements={result.improvements}
        />
      </section>

      <section>
        <h2 className="mb-2 text-xs text-[var(--muted)]">Question breakdown</h2>
        <QuestionBreakdown questions={result.questions} />
      </section>
    </div>
  );
}