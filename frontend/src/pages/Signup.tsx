import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout, { authInputClass } from "../components/AuthLayout";
import { mockSignup } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate(): string {
    if (!form.fullName.trim()) return "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords don't match.";
    return "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { fullName, email, password } = form;
      const res = await mockSignup({ fullName, email, password });
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const label = "mb-1.5 mt-3 block text-[13px] text-[var(--auth-navy)]";

  return (
    <AuthLayout tagline="Create your account to start practicing">
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="fullName" className="mb-1.5 block text-[13px] text-[var(--auth-navy)]">Full name</label>
        <input id="fullName" name="fullName" type="text" className={authInputClass}
               placeholder="Harshita Sharma" value={form.fullName} onChange={handleChange} />

        <label htmlFor="email" className={label}>Email</label>
        <input id="email" name="email" type="email" className={authInputClass}
               placeholder="name@company.com" value={form.email} onChange={handleChange} />

        <label htmlFor="password" className={label}>Password</label>
        <input id="password" name="password" type="password" className={authInputClass}
               placeholder="At least 8 characters" value={form.password} onChange={handleChange} />

        <label htmlFor="confirmPassword" className={label}>Confirm password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" className={authInputClass}
               placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} />

        {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

        <button type="submit" disabled={loading}
                className="mt-5 h-[42px] w-full rounded-lg bg-[var(--auth-blue)] font-medium text-white disabled:opacity-60">
          {loading ? "Creating account…" : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm text-[var(--auth-muted)]">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[var(--auth-blue)]">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}