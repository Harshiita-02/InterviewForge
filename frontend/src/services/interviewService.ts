import { jsPDF } from "jspdf";
import { apiFetch } from "../lib/apiClient";
import type {
  CreateSessionRequest,
  InterviewQuestion,
  InterviewSessionInfo,
  SetupOptions,
  SubmitAnswerRequest,
} from "../types/interview";
import type { InterviewResult } from "../types/results";

const ROLES = [
  "Java Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Software Engineer",
];

// ---- shapes the backend sends ----
interface ApiTopic {
  id: number;
  name: string;
}

interface ApiTemplate {
  id: number;
  companyName: string;
  topicNames: string[];
}

interface ApiResume {
  id: number;
  fileName: string;
}

// ---------- Setup ----------

export async function getSetupOptions(): Promise<SetupOptions> {
  const [topics, templates, resumes] = await Promise.all([
    apiFetch<ApiTopic[]>("/api/topics/predefined"),
    apiFetch<ApiTemplate[]>("/api/templates"),
    apiFetch<ApiResume[]>("/api/resumes"),
  ]);

  return {
    roles: ROLES,
    topics: topics.map((t) => t.name),
    resumes: resumes.map((r) => ({ id: r.id, name: r.fileName })),
    companies: templates.map((t) => ({ id: t.id, name: t.companyName, topics: t.topicNames })),
  };
}

export async function createSession(req: CreateSessionRequest): Promise<{ sessionId: number }> {
  // The backend uses upper-case names: "Technical" -> "TECHNICAL", "Medium" -> "MEDIUM".
  const session = await apiFetch<{ id: number }>("/api/sessions", {
    method: "POST",
    body: {
      role: req.role,
      interviewType: req.type.toUpperCase(),
      difficulty: req.difficulty.toUpperCase(),
      companyTemplateId: req.companyTemplateId,
      resumeId: req.resumeId,
      topics: req.topics,
    },
  });
  return { sessionId: session.id };
}

// ---------- Live interview ----------

// question is null when the interview is