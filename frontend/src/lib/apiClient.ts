const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const TOKEN_KEY = "token";

export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean; // false for login and signup, which have no token yet
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {};
  const token = tokenStore.get();
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body; // the browser sets the multipart Content-Type itself
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check that the backend is running.");
  }

  // A 401 while we were logged in means the token expired or is invalid
  if (response.status === 401 && auth && token) {
    tokenStore.clear();
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    if (response.status === 401) {
      message = "Your session has expired. Please log in again.";
    }
    try {
      const data = await response.json();
      if (data && typeof data.message === "string") {
        message = data.message; // the backend's own message wins
      }
    } catch {
      // the response had no JSON body; keep the default message
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}