import { useEffect, useState } from "react";
import type { ProgressData } from "../types/progress";
import { getProgress } from "../services/progressService";
import { computeProgressStats } from "../utils/progress";
import StatGrid, { type StatItem } from "../components/ui/StatGrid";
import ScoreTrend from "../components/progress/ScoreTrend";
import TopicScores from "../components/progress/TopicScores";
import HistoryList from "../components/progress/HistoryList";

export default function Progress() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProgress()
      .then(setData)
      .catch(() => setError("Couldn't load your progress. Please refresh."));
  }, []);

  if (!data) {
    return (
      <p className={"text-sm " + (error ? "text-[var(--bad)]" : "text-[var(--muted)]")}>
        {error || "Loading…"}
      </p>
    );
  }

  const scores = [...data.scores].sort((a, b) => a.completedAt.localeCompare(b.completedAt));
  const stats = computeProgressStats(scores);

  const improvementText =
    stats.improvement === null
      ? "—"
      : `${stats.improvement > 0 ? "+" : ""}${stats.improvement} pts`;
  const improvementClass =
    stats.improvement === null || stats.improvement === 0
      ? ""
      : stats.improvement > 0
        ? "text-[var(--good)]"
        : "text-[var(--bad)]";

  const items: StatItem[] = [
    { label: "Interviews", value: String(stats.total) },
    { label: "Avg. score", value: stats.average === null ? "—" : `${stats.average}%` },
    { label: "Best score", value: stats.best === null ? "—" : `${stats.best}%` },
    { label: "Since first 5", value: improvementText, valueClass: improvementClass },
  ];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-[21px] font-medium">Progress</h1>
        <p className="mt-1 text-[13px] text-[var(--muted)]">Track how your scores change over time.</p>
      </div>

      <StatGrid items={items} />
      <ScoreTrend scores={scores} />
      <TopicScores topics={data.topics} />
      <HistoryList items={data.history} />
    </div>
  );
}