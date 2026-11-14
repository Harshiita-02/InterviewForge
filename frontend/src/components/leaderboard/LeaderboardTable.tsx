import type { LeaderboardData } from "../../types/leaderboard";
import LeaderboardRow from "./LeaderboardRow";

export default function LeaderboardTable({ data }: { data: LeaderboardData }) {
  const { top, yourRank, yourEntry } = data;
  const youInTop = top.some((e) => e.userId === yourEntry.userId);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      {top.map((entry, i) => (
        <LeaderboardRow
          key={entry.userId}
          rank={i + 1}
          name={entry.name}
          interviews={entry.interviews}
          averageScore={entry.averageScore}
          isYou={entry.userId === yourEntry.userId}
          isFirstRow={i === 0}
        />
      ))}

      {!youInTop && (
        <>
          <div className="border-t border-[var(--border)] py-1 text-center text-xs leading-none text-[var(--muted)]">
            ⋯
          </div>
          <LeaderboardRow
            rank={yourRank}
            name={yourEntry.name}
            interviews={yourEntry.interviews}
            averageScore={yourEntry.averageScore}
            isYou
            isFirstRow={false}
          />
        </>
      )}
    </div>
  );
}