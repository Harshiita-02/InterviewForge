import { apiFetch } from "../lib/apiClient";
import type { LeaderboardData, LeaderboardPeriod } from "../types/leaderboard";

export async function getLeaderboard(period: LeaderboardPeriod): Promise<LeaderboardData> {
  return apiFetch<LeaderboardData>(`/api/leaderboard?period=${period}`);
}