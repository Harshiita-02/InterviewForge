import { apiFetch } from "../lib/apiClient";
import type { PasswordChange, UserProfile } from "../types/settings";

interface ApiUser {
  id: number;
  name: string;
  email: string;
}

export async function getProfile(): Promise<UserProfile> {
  const user = await apiFetch<ApiUser>("/api/users/me");
  return { fullName: user.name, email: user.email };
}

export async function updateProfile(fullName: string): Promise<UserProfile> {
  const user = await apiFetch<ApiUser>("/api/users/me", {
    method: "PUT",
    body: { name: fullName },
  });
  return { fullName: user.name, email: user.email };
}

// The backend checks the current password and answers 400 "Current password is incorrect" if it is wrong
export async function changePassword(change: PasswordChange): Promise<void> {
  await apiFetch<void>("/api/users/me/password", {
    method: "PUT",
    body: {
      currentPassword: change.currentPassword,
      newPassword: change.newPassword,
    },
  });
}