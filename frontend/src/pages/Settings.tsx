import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useTheme } from "../context/ThemeContext";
import { changePassword, getProfile, updateProfile } from "../services/settingsService";
import { useAuth } from "../context/AuthContext";

type Mode = "light" | "dark";

const card = "rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5";
const label = "mb-1 block text-sm text-[var(--muted)]";
const input =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]";
const outlineButton =
  "rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--accent-soft)]";

export default function Settings() {
  const themeCtx = useTheme() as unknown as {
    theme: Mode;
    setTheme?: (mode: Mode) => void;
    toggleTheme?: () => void;
  };
    const { updateUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    getProfile().then((p) => {
      setFullName(p.fullName);
      setEmail(p.email);
    });
  }, []);

  function chooseTheme(mode: Mode) {
    if (themeCtx.theme === mode) return;
    if (themeCtx.setTheme) themeCtx.setTheme(mode);
    else themeCtx.toggleTheme?.();
  }

    async function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    setProfileMsg("");
    if (!fullName.trim()) {
      setProfileError("Enter your name.");
      return;
    }
    setProfileError("");
    try {
      const saved = await updateProfile(fullName.trim());
      updateUser({ fullName: saved.fullName });   // the top bar changes right away
      setProfileMsg("Saved");
      setTimeout(() => setProfileMsg(""), 2500);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Couldn't save your changes.");
    }
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPasswordMsg("");
    if (!currentPassword) {
      setPasswordError("Enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Use at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("The passwords don't match.");
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordError("");
      setPasswordMsg("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Couldn't update your password.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-xl font-medium text-[var(--text)]">Settings</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Manage your profile, appearance and password.
      </p>

      <form onSubmit={handleProfileSave} className={`${card} mt-6`}>
        <h2 className="mb-4 text-base font-medium text-[var(--text)]">Profile</h2>
        <label className={label} htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          className={input}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <label className={`${label} mt-4`} htmlFor="email">Email</label>
        <input
          id="email"
          className={`${input} cursor-not-allowed opacity-60`}
          value={email}
          readOnly
        />
        <div className="mt-4 flex items-center gap-3">
          <button type="submit" className={outlineButton}>Save changes</button>
          {profileMsg && <span className="text-sm text-[var(--good)]">{profileMsg}</span>}
          {profileError && <span className="text-sm text-[var(--bad)]">{profileError}</span>}
        </div>
      </form>

      <div className={`${card} mt-4`}>
        <h2 className="mb-4 text-base font-medium text-[var(--text)]">Appearance</h2>
        <div className="inline-flex overflow-hidden rounded-lg border border-[var(--border)]">
          {(["light", "dark"] as Mode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => chooseTheme(mode)}
              className={`px-4 py-2 text-sm capitalize ${
                themeCtx.theme === mode
                  ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                  : "text-[var(--text)] hover:bg-[var(--accent-soft)]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handlePasswordChange} className={`${card} mt-4`}>
        <h2 className="mb-4 text-base font-medium text-[var(--text)]">Change password</h2>
        <label className={label} htmlFor="currentPassword">Current password</label>
        <input
          id="currentPassword"
          type="password"
          className={input}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <label className={`${label} mt-4`} htmlFor="newPassword">New password</label>
        <input
          id="newPassword"
          type="password"
          className={input}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label className={`${label} mt-4`} htmlFor="confirmPassword">Confirm new password</label>
        <input
          id="confirmPassword"
          type="password"
          className={input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="mt-4 flex items-center gap-3">
          <button type="submit" className={outlineButton}>Update password</button>
          {passwordMsg && <span className="text-sm text-[var(--good)]">{passwordMsg}</span>}
          {passwordError && <span className="text-sm text-[var(--bad)]">{passwordError}</span>}
        </div>
      </form>
    </div>
  );
}