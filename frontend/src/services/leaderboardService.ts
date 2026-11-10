import type { LeaderboardData, LeaderboardEntry, LeaderboardPeriod } from "../types/leaderboard";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const YOUR_ID = 0;

const BASE: Record<LeaderboardPeriod, { total: number; top: LeaderboardEntry[] }> = {
  week: {
    total: 128,
    top: [
      { userId: 1, name: "Aarav S.", interviews: 6, averageScore: 92 },
      { userId: 2, name: "Priya M.", interviews: 7, averageScore: 91 },
      { userId: 3, name: "Kabir R.", interviews: 5, averageScore: 90 },
      { userId: 4, name: "Ananya T.", interviews: 6, averageScore: 88 },
      { userId: 5, name: "Rohan K.", interviews: 4, averageScore: 87 },
      { userId: 6, name: "Ishita D.", interviews: 5, averageScore: 86 },
      { userId: YOUR_ID, name: "Harshita", interviews: 5, averageScore: 84 },
      { userId: 7, name: "Vikram J.", interviews: 4, averageScore: 83 },
      { userId: 8, name: "Meera P.", interviews: 6, averageScore: 82 },
      { userId: 9, name: "Arjun N.", interviews: 3, averageScore: 81 },
    ],
  },
  month: {
    total: 214,
    top: [
      { userId: 2, name: "Priya M.", interviews: 14, averageScore: 93 },
      { userId: 1, name: "Aarav S.", interviews: 16, averageScore: 91 },
      { userId: 3, name: "Kabir R.", interviews: 11, averageScore: 89 },
      { userId: YOUR_ID, name: "Harshita", interviews: 12, averageScore: 87 },
      { userId: 4, name: "Ananya T.", interviews: 13, averageScore: 86 },
      { userId: 5, name: "Rohan K.", interviews: 9, averageScore: 85 },
      { userId: 6, name: "Ishita D.", interviews: 10, averageScore: 84 },
      { userId: 8, name: "Meera P.", interviews: 12, averageScore: 83 },
      { userId: 7, name: "Vikram J.", interviews: 8, averageScore: 82 },
      { userId: 10, name: "Sneha B.", interviews: 9, averageScore: 81 },
    ],
  },
  all: {
    total: 356,
    top: [
      { userId: 1, name: "Aarav S.", interviews: 41, averageScore: 95 },
      { userId: 2, name: "Priya M.", interviews: 38, averageScore: 94 },
      { userId: 3, name: "Kabir R.", interviews: 35, averageScore: 92 },
      { userId: 4, name: "Ananya T.", interviews: 33, averageScore: 91 },
      { userId: 5, name: "Rohan K.", interviews: 30, averageScore: 90 },
      { userId: 8, name: "Meera P.", interviews: 29, averageScore: 89 },
      { userId: 6, name: "Ishita D.", interviews: 27, averageScore: 88 },
      { userId: 7, name: "Vikram J.", interviews: 26, averageScore: 86 },
      { userId: 9, name: "Arjun N.", interviews: 22, averageScore: 85 },
      { userId: 10, name: "Sneha B.", interviews: 21, averageScore: 84 },
    ],
  },
};

const YOUR_RANK: Record<LeaderboardPeriod, number> = { week: 7, month: 4, all: 14 };
const YOUR_ALL_TIME: LeaderboardEntry = { userId: YOUR_ID, name: "Harshita", interviews: 24, averageScore: 74 };

export async function getLeaderboard(period: LeaderboardPeriod): Promise<LeaderboardData> {
  await wait(350);
  const { total, top } = BASE[period];
  const yourRank = YOUR_RANK[period];
  const yourEntry = top.find((e) => e.userId === YOUR_ID) ?? YOUR_ALL_TIME;

  return {
    period,
    totalStudents: total,
    yourRank,
    yourEntry,
    pointsToNextRank: yourRank === 1 ? null : 2,
    top,
  };
}