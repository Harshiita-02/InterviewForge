import { apiFetch } from "../lib/apiClient";
import type { ProgressData } from "../types/progress";

export async function getProgress(): Promise<ProgressData> {
  return apiFetch<ProgressData>("/api/progress");
}