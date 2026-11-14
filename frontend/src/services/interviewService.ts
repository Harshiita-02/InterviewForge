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

// question is null when the interview is already finished
export async function getInterview(
  sessionId: number
): Promise<{ session: InterviewSessionInfo; question: InterviewQuestion | null }> {
  return apiFetch(`/api/interviews/${sessionId}`);
}

export async function submitAnswer(
  sessionId: number,
  req: SubmitAnswerRequest
): Promise<{ nextQuestion: InterviewQuestion | null }> {
  return apiFetch(`/api/interviews/${sessionId}/answers`, {
    method: "POST",
    body: { questionId: req.questionId, text: req.text, source: req.source },
  });
}

export async function endInterview(sessionId: number): Promise<void> {
  await apiFetch(`/api/sessions/${sessionId}/end`, { method: "PATCH" });
}

// ---------- Results ----------

export async function getResult(sessionId: number): Promise<InterviewResult> {
  return apiFetch(`/api/interviews/${sessionId}/result`);
}

// Characters the built-in PDF font cannot draw are simplified or dropped
function pdfSafe(text: string): string {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[^\n\x20-\x7E\u00A0-\u00FF]/g, "");
}

export async function downloadReport(sessionId: number): Promise<{ blob: Blob; filename: string }> {
  const result = await getResult(sessionId);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  // Writes wrapped text and starts a new page when the current one is full
  function write(text: string, size = 11, bold = false, gapAfter = 6) {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines: string[] = doc.splitTextToSize(pdfSafe(text), maxWidth);
    for (const line of lines) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += size * 1.4;
    }
    y += gapAfter;
  }

  write("InterviewForge - Interview Report", 18, true, 8);
  write(`${result.role} | ${result.type} | ${result.finalDifficulty}`, 12, false, 2);
  write(`Completed: ${new Date(result.completedAt).toLocaleString()}`, 10, false, 10);

  write(`Overall score: ${Math.round(result.overallScore)} / 100`, 14, true, 2);
  write(
    `Answered ${result.answeredCount} of ${result.totalQuestions} questions in about ${result.durationMinutes} min`,
    10, false, 12
  );

  write("Summary", 13, true, 4);
  write(result.summary, 11, false, 10);

  if (result.strengths.length > 0) {
    write("Strengths", 13, true, 4);
    result.strengths.forEach((s) => write(`- ${s}`, 11, false, 2));
    y += 8;
  }

  if (result.improvements.length > 0) {
    write("Areas to improve", 13, true, 4);
    result.improvements.forEach((s) => write(`- ${s}`, 11, false, 2));
    y += 8;
  }

  write("Question breakdown", 13, true, 6);
  result.questions.forEach((q) => {
    const tag = q.isFollowUp ? " (follow-up)" : "";
    write(`Q${q.number}${tag} - score ${Math.round(q.score)} / 100`, 11, true, 2);
    write(q.question, 11, false, 2);
    write(`Your answer: ${q.answer}`, 10, false, 2);
    write(`Feedback: ${q.feedback}`, 10, false, 12);
  });

  return {
    blob: doc.output("blob"),
    filename: `interviewforge-report-${sessionId}.pdf`,
  };
}