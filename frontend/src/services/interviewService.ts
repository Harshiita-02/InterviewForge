import type { CreateSessionRequest, SetupOptions } from "../types/interview";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getSetupOptions(): Promise<SetupOptions> {
  await wait(300);
  return {
    roles: ["Java Developer", "Frontend Developer", "Full Stack Developer", "Data Analyst", "Software Engineer"],
    topics: ["Java", "Spring Boot", "DBMS", "SQL", "DSA", "OOP", "React", "System Design"],
    resumes: [{ id: 1, name: "My latest resume" }],
    companies: [
      { id: 1, name: "TCS", topics: ["Java", "DBMS", "OOP"] },
      { id: 2, name: "Infosys", topics: ["Java", "SQL", "DSA"] },
      { id: 3, name: "Accenture", topics: ["Java", "SQL", "OOP"] },
    ],
  };
}

export async function createSession(req: CreateSessionRequest): Promise<{ sessionId: number }> {
  await wait(500);
  console.log("Creating session with", req);
  return { sessionId: 25 };
}

import type {
  InterviewQuestion, InterviewSessionInfo, SubmitAnswerRequest,
  // ...existing imports
} from "../types/interview";

const MOCK_QUESTIONS: InterviewQuestion[] = [
  { id: 1, number: 1, total: 5, isFollowUp: false, difficulty: "Medium", timeLimitSeconds: 120, difficultyNote: null,
    text: "Explain the difference between an abstract class and an interface in Java, and when you would choose one over the other." },
  { id: 2, number: 2, total: 5, isFollowUp: false, difficulty: "Medium", timeLimitSeconds: 120, difficultyNote: null,
    text: "What is the difference between HashMap and ConcurrentHashMap, and when would you use each?" },
  { id: 3, number: 3, total: 5, isFollowUp: true, difficulty: "Hard", timeLimitSeconds: 180,
    difficultyNote: "Difficulty raised from Medium to Hard because your last two answers were strong.",
    text: "You mentioned default methods in interfaces. How do they affect the diamond problem, and how does Java resolve a conflict?" },
  { id: 4, number: 4, total: 5, isFollowUp: false, difficulty: "Hard", timeLimitSeconds: 180, difficultyNote: null,
    text: "Explain how Spring Boot auto-configuration works and how you would override it." },
  { id: 5, number: 5, total: 5, isFollowUp: false, difficulty: "Hard", timeLimitSeconds: 180, difficultyNote: null,
    text: "How would you design a REST API for a library management system?" },
];

let mockIndex = 0;

export async function getInterview(
  sessionId: number
): Promise<{ session: InterviewSessionInfo; question: InterviewQuestion }> {
  await wait(300);
  mockIndex = 0;
  return {
    session: { id: sessionId, role: "Java Developer", type: "Technical" },
    question: MOCK_QUESTIONS[0],
  };
}

export async function submitAnswer(
  sessionId: number,
  req: SubmitAnswerRequest
): Promise<{ nextQuestion: InterviewQuestion | null }> {
  await wait(500);
  console.log("Submitting answer", sessionId, req);
  mockIndex += 1;
  return { nextQuestion: MOCK_QUESTIONS[mockIndex] ?? null };
}

export async function transcribeAudio(_audio: Blob): Promise<string> {
  await wait(800);
  return "An abstract class can hold state and constructors, while an interface defines a contract. I would pick an interface when unrelated classes need the same behaviour.";
}

export async function endInterview(_sessionId: number): Promise<void> {
  await wait(200);
}


import type { InterviewResult } from "../types/results";

export async function getResult(sessionId: number): Promise<InterviewResult> {
  await wait(400);
  return {
    sessionId,
    role: "Java Developer",
    type: "Technical",
    finalDifficulty: "Hard",
    completedAt: new Date().toISOString(),
    overallScore: 76,
    answeredCount: 5,
    totalQuestions: 5,
    durationMinutes: 14,
    summary:
      "Strong grasp of Java fundamentals with clear, well-structured explanations. Your answers on interfaces and collections were precise. Spring Boot internals were the weak spot, so revisit auto-configuration before your next round.",
    strengths: [
      "Clear, structured explanations",
      "Accurate Java terminology",
      "Handled the default methods follow-up well",
    ],
    improvements: [
      "Spring Boot auto-configuration details",
      "Give concrete examples when comparing options",
      "Mention trade-offs before recommending a design",
    ],
    questions: [
      { id: 1, number: 1, isFollowUp: false, score: 85,
        question: "Explain the difference between an abstract class and an interface in Java, and when you would choose one over the other.",
        answer: "An abstract class can hold state and constructors, while an interface defines a contract. I would pick an interface when unrelated classes need the same behaviour.",
        feedback: "Accurate and concise. Adding that Java 8 default methods blur the line between the two would have made it complete." },
      { id: 2, number: 2, isFollowUp: false, score: 72,
        question: "What is the difference between HashMap and ConcurrentHashMap, and when would you use each?",
        answer: "ConcurrentHashMap is thread safe and HashMap is not, so I would use ConcurrentHashMap in multithreaded code.",
        feedback: "Correct direction, but it misses how the locking works and why it beats a synchronized map for throughput." },
      { id: 3, number: 3, isFollowUp: true, score: 90,
        question: "You mentioned default methods in interfaces. How do they affect the diamond problem, and how does Java resolve a conflict?",
        answer: "If two interfaces provide the same default method, the class must override it and can pick one with the interface name and super.",
        feedback: "Excellent. You named the conflict rule and the exact syntax to resolve it." },
      { id: 4, number: 4, isFollowUp: false, score: 55,
        question: "Explain how Spring Boot auto-configuration works and how you would override it.",
        answer: "Spring Boot configures beans automatically based on what is on the classpath.",
        feedback: "Too brief. Cover conditional annotations, how the starters trigger it, and how to override a bean." },
      { id: 5, number: 5, isFollowUp: false, score: 80,
        question: "How would you design a REST API for a library management system?",
        answer: "Resources for books, members and loans, with standard HTTP verbs, pagination on list endpoints and JWT for auth.",
        feedback: "Well organised. Mention error responses and versioning to round it out." },
    ],
  };
}

export async function downloadReport(sessionId: number): Promise<{ blob: Blob; filename: string }> {
  await wait(600);
  return {
    blob: new Blob([`InterviewForge mock report for session ${sessionId}`], { type: "text/plain" }),
    filename: `interviewforge-report-${sessionId}.txt`,
  };
}