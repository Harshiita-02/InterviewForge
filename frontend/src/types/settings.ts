export interface UserProfile {
  fullName: string;
  email: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}