import type { Difficulty, InterviewType } from "./interview";

export interface ScorePoint {
  sessionId: number;
  completedAt: string;
  score: number;
}

export interface TopicScore {
  topic: string;
  score: number;
}

export interface HistoryItem {
  id: number;
  title: string;
  type: InterviewType;
  difficulty: Difficulty;
  completedAt: string;
  score: number;
}

export interface ProgressData {
  scores: ScorePoint[];
  topics: TopicScore[];
  history: HistoryItem[];
}