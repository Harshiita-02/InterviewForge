import type { Resume } from "../types/resume";

let resumes: Resume[] = [
  {
    id: 1,
    fileName: "Harshita_Resume_Java.pdf",
    uploadedAt: "2026-11-08T10:00:00",
    sizeKb: 240,
    interviewsUsed: 4,
  },
  {
    id: 2,
    fileName: "Harshita_Resume_FullStack.pdf",
    uploadedAt: "2026-10-21T10:00:00",
    sizeKb: 198,
    interviewsUsed: 2,
  },
  {
    id: 3,
    fileName: "Resume_Old.pdf",
    uploadedAt: "2026-09-02T10:00:00",
    sizeKb: 210,
    interviewsUsed: 0,
  },
];

export async function getResumes(): Promise<Resume[]> {
  return [...resumes];
}

export async function uploadResume(file: File): Promise<Resume> {
  const created: Resume = {
    id: Date.now(),
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
    sizeKb: Math.max(1, Math.round(file.size / 1024)),
    interviewsUsed: 0,
  };
  resumes = [created, ...resumes];
  return created;
}

export async function deleteResume(id: number): Promise<void> {
  resumes = resumes.filter((r) => r.id !== id);
}