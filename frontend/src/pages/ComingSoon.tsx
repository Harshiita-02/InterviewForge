export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h1 className="text-lg font-medium">{title}</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">This screen is coming soon.</p>
    </div>
  );
}