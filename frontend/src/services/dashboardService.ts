import type { DashboardData } from "../types/dashboard";

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

export async function getDashboardData(): Promise<DashboardData> {
  await new Promise((r) => setTimeout(r, 400));
  return {
    stats: { totalInterviews: 24, completedInterviews: 21, averageScore: 72, bestScore: 91 },
    suggestion: { topic: "DBMS", difficulty: "Medium", reason: "Your lowest topic at 58%" },
    recentSessions: [
      { id: 24, title: "Java Developer, Technical", completedAt: daysAgo(0), score: 82 },
      { id: 23, title: "HR Round, Hard", completedAt: daysAgo(1), score: 74 },
      { id: 22, title: "DBMS, Medium", completedAt: daysAgo(5), score: 58 },
    ],
  };
}