import { apiFetch } from "../lib/apiClient";
import type { DashboardData } from "../types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  return apiFetch<DashboardData>("/api/dashboard");
}