import type { PasswordChange, UserProfile } from "../types/settings";

let profile: UserProfile = {
  fullName: "Harshita",
  email: "student@example.com",
};

export async function getProfile(): Promise<UserProfile> {
  return { ...profile };
}

export async function updateProfile(fullName: string): Promise<UserProfile> {
  profile = { ...profile, fullName };
  return { ...profile };
}

export async function changePassword(change: PasswordChange): Promise<void> {
  if (!change.currentPassword) {
    throw new Error("Enter your current password.");
  }
}