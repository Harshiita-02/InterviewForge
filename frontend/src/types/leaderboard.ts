export type LeaderboardPeriod = "week" | "month" | "all";

export interface LeaderboardEntry {
  userId: number;
  name: string;
  interviews: number;
  averageScore: number;
}

export interface LeaderboardData {
  period: LeaderboardPeriod;
  totalStudents: number;
  yourRank: number;
  yourEntry: LeaderboardEntry;
  pointsToNextRank: number | null;
  top: LeaderboardEntry[];
}