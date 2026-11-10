export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  token: string;
  user: { id: number; fullName: string; email: string };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: { id: number; email: string };
}

export interface CurrentUser {
  id: number;
  fullName: string;
  email: string;
}

export async function mockLogin(req: LoginRequest): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    token: "mock-jwt-token",
    user: { id: 1, email: req.email },
  };
}

export async function mockSignup(req: SignupRequest): Promise<SignupResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (req.email === "taken@test.com") {
    throw new Error("An account with this email already exists.");
  }

  return {
    token: "mock-jwt-token",
    user: { id: 2, fullName: req.fullName, email: req.email },
  };
}

export async function getCurrentUser(): Promise<CurrentUser> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { id: 1, fullName: "Harshita", email: "harshita@example.com" };
}
