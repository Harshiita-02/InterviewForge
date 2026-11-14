import { apiFetch } from "../lib/apiClient";
import type { Resume } from "../types/resume";

export async function getResumes(): Promise<Resume[]> {
  return apiFetch<Resume[]>("/api/resumes");
}

export async function uploadResume(file: File): Promise<Resume> {
  const form = new FormData();
  form.append("file", file); // the backend reads the part named "file"
  return apiFetch<Resume>("/api/resumes", { method: "POST", body: form });
}

export async function deleteResume(id: number): Promise<void> {
  await apiFetch<void>(`/api/resumes/${id}`, { method: "DELETE" });
}