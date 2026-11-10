import type { ReactNode } from "react";

export const controlClass =
  "h-[38px] w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] " +
  "px-2.5 text-[13px] text-[var(--text)] outline-none focus:border-[var(--accent)]";

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}

export default function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="text-xs text-[var(--muted)]">{label}</label>
        {hint && <span className="text-xs text-[var(--muted)]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}