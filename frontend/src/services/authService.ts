import { apiFetch } from "../lib/apiClient";

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CurrentUser {
  id: number;
  fullName: string;
  email: string;
}

export interface LoginResult {
  token: string;
  user: CurrentUser;
}

// The shapes the backend sends
interface ApiUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface ApiLoginResponse {
  token: string;
  user: ApiUser;
}

// The backend says "name"; the screens say "fullName"
function toCurrentUser(user: ApiUser): CurrentUser {
  return { id: user.id, fullName: user.name, email: user.email };
}

export async function login(req: LoginRequest): Promise<LoginResult> {
  const res = await apiFetch<ApiLoginResponse>("/api/auth/login", {
    method: "POST",
    body: req,
    auth: false,
  });
  return { token: res.token, user: toCurrentUser(res.user) };
}

export async function signup(req: SignupRequest): Promise<void> {
  await apiFetch<ApiUser>("/api/auth/signup", {
    method: "POST",
    body: { name: req.fullName, email: req.email, password: req.password },
    auth: false,
  });
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const user = await apiFetch<ApiUser>("/api/users/me");
  return toCurrentUser(user);
}