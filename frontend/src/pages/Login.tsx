import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout, { authInputClass } from "../components/AuthLayout";
import { mockLogin } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await mockLogin({ email, password });
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout tagline="Log in to keep practicing">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="mb-1.5 block text-[13px] text-[var(--auth-navy)]">Email</label>
        <input id="email" type="email" className={authInputClass} placeholder="name@company.com"
               value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password" className="mb-1.5 mt-3.5 block text-[13px] text-[var(--auth-navy)]">Password</label>
        <input id="password" type="password" className={authInputClass} placeholder="Enter your password"
               value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="mb-4 mt-2 text-right">
          <Link to="/forgot-password" className="text-[13px] text-[var(--auth-blue)]">Forgot password?</Link>
        </div>

        {error && <p className="mb-3 text-[13px] text-red-600">{error}</p>}

        <button type="submit" disabled={loading}
                className="h-[42px] w-full rounded-lg bg-[var(--auth-blue)] font-medium text-white disabled:opacity-60">
          {loading ? "Logging in…" : "Log in"}
        </button>

        <p className="mt-4 text-center text-sm text-[var(--auth-muted)]">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-[var(--auth-blue)]">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
}