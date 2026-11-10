import type { ReactNode } from "react";
import Logo from "./Logo";

export const authInputClass =
  "h-10 w-full rounded-lg border border-[var(--auth-border)] bg-white px-3 " +
  "text-[var(--auth-navy)] outline-none focus:border-[var(--auth-blue)]";

interface AuthLayoutProps {
  tagline: string;
  children: ReactNode;
}

export default function AuthLayout({ tagline, children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--auth-bg)] px-4 py-8">
      <svg viewBox="0 0 680 560" preserveAspectRatio="none"
           className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M0 400 C 180 320, 380 470, 680 360 L680 560 L0 560 Z" fill="var(--auth-curve-1)" />
        <path d="M0 470 C 220 410, 420 520, 680 450 L680 560 L0 560 Z" fill="var(--auth-curve-2)" />
      </svg>

      <div className="relative w-full max-w-sm rounded-2xl border border-[var(--auth-border)] bg-white p-8">
        <Logo tagline={tagline} />
        {children}
      </div>
    </div>
  );
}