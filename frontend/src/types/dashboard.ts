export interface DashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  bestScore: number;
}

export interface SuggestedInterview {
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  reason: string;
}

export interface RecentSession {
  id: number;
  title: string;
  completedAt: string;
  score: number;
}

export interface DashboardData {
  stats: DashboardStats;
  suggestion: SuggestedInterview | null;
  recentSessions: RecentSession[];
}