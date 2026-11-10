import type { Difficulty, InterviewType } from "./interview";

export interface QuestionResult {
  id: number;
  number: number;
  question: string;
  isFollowUp: boolean;
  answer: string;
  score: number;
  feedback: string;
}

export interface InterviewResult {
  sessionId: number;
  role: string;
  type: InterviewType;
  finalDifficulty: Difficulty;
  completedAt: string;
  overallScore: number;
  answeredCount: number;
  totalQuestions: number;
  durationMinutes: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  questions: QuestionResult[];
}