import type { ProgressData } from "../types/progress";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

const SCORES = [58, 61, 64, 60, 66, 69, 67, 72, 70, 74, 71, 76, 75, 78, 55, 77, 80, 76, 79, 82, 78, 91, 80, 88];

const RECENT_META = [
  { title: "Java Developer, Technical", type: "Technical", difficulty: "Hard" },
  { title: "HR Round", type: "HR", difficulty: "Medium" },
  { title: "DBMS Practice", type: "Technical", difficulty: "Hard" },
  { title: "HR Round", type: "HR", difficulty: "Hard" },
  { title: "Spring Boot, Technical", type: "Technical", difficulty: "Medium" },
  { title: "Frontend Developer, Technical", type: "Technical", difficulty: "Easy" },
  { title: "HR Round", type: "HR", difficulty: "Medium" },
  { title: "Java Developer, Technical", type: "Technical", difficulty: "Medium" },
  { title: "DSA Practice", type: "Technical", difficulty: "Easy" },
  { title: "Java Developer, Technical", type: "Technical", difficulty: "Medium" },
] as const;

export async function getProgress(): Promise<ProgressData> {
  await wait(400);
  const last = SCORES.length - 1;

  return {
    scores: SCORES.map((score, i) => ({
      sessionId: i + 1,
      completedAt: daysAgo((last - i) * 2),
      score,
    })),
    topics: [
      { topic: "Java", score: 84 },
      { topic: "HR", score: 78 },
      { topic: "DSA", score: 72 },
      { topic: "Spring Boot", score: 66 },
      { topic: "DBMS", score: 58 },
    ],
    history: RECENT_META.map((meta, k) => ({
      id: SCORES.length - k,
      ...meta,
      completedAt: daysAgo(k * 2),
      score: SCORES[last - k],
    })),
  };
}