import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function Section({ title, action, children }: SectionProps) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs text-[var(--muted)]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}