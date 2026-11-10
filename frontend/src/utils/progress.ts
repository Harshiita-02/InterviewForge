import type { ScorePoint } from "../types/progress";

export interface ProgressStats {
  total: number;
  average: number | null;
  best: number | null;
  improvement: number | null;
}

export function computeProgressStats(scores: ScorePoint[]): ProgressStats {
  const values = scores.map((s) => s.score);
  if (values.length === 0) {
    return { total: 0, average: null, best: null, improvement: null };
  }

  const mean = (list: number[]) => list.reduce((sum, v) => sum + v, 0) / list.length;

  return {
    total: values.length,
    average: Math.round(mean(values)),
    best: Math.max(...values),
    improvement:
      values.length >= 10
        ? Math.round(mean(values.slice(-5)) - mean(values.slice(0, 5)))
        : null,
  };
}