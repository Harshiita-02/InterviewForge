import { useEffect, useState } from "react";
import type { LeaderboardData, LeaderboardPeriod } from "../types/leaderboard";
import { getLeaderboard } from "../services/leaderboardService";
import SegmentedControl from "../components/ui/SegmentedControl";
import StatGrid, { type StatItem } from "../components/ui/StatGrid";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";

const PERIODS: LeaderboardPeriod[] = ["week", "month", "all"];
const PERIOD_LABEL: Record<LeaderboardPeriod, string> = {
  week: "This week",
  month: "This month",
  all: "All time",
};

export default function Leaderboard() {
  const [period, setPeriod] = useState<LeaderboardPeriod>("week");
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setData(null);
    getLeaderboard(period)
      .then(setData)
      .catch(() => setError("Couldn't load the leaderboard. Please refresh."));
  }, [period]);

  const items: StatItem[] | null = data && [
    { label: `Your rank of ${data.totalStudents}`, value: `#${data.yourRank}` },
    { label: "Avg. score", value: `${data.yourEntry.averageScore}%` },
    { label: "Interviews", value: String(data.yourEntry.interviews) },
    {
      label: data.pointsToNextRank === null ? "Rank" : `To reach #${data.yourRank - 1}`,
      value: data.pointsToNextRank === null ? "You're #1" : `+${data.pointsToNextRank} pts`,
    },
  ];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[21px] font-medium">Leaderboard</h1>
          <p className="mt-1 text-[13px] text-[var(--muted)]">See how you rank against other students.</p>
        </div>
        <SegmentedControl
          compact
          options={PERIODS}
          value={period}
          onChange={setPeriod}
          getLabel={(p) => PERIOD_LABEL[p]}
        />
      </div>

      {error && <p className="text-[13px] text-[var(--bad)]">{error}</p>}

      {!data ? (
        <p className="text-sm text-[var(--muted)]">Loading…</p>
      ) : (
        <>
          <StatGrid items={items!} />

          <section>
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-xs text-[var(--muted)]">Top 10</h2>
              <span className="text-xs text-[var(--muted)]">Ranked by average score</span>
            </div>
            <LeaderboardTable data={data} />
          </section>
        </>
      )}
    </div>
  );
}