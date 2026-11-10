export const LOW_SCORE_THRESHOLD = 60;

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function formatSessionDate(iso: string): string {
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const date = new Date(iso);
  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / (24 * 60 * 60 * 1000)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function scoreTextClass(score: number): string {
  return score >= LOW_SCORE_THRESHOLD ? "text-[var(--good)]" : "text-[var(--bad)]";
}

export function formatCompleted(iso: string): string {
  const label = formatSessionDate(iso);
  return label === "Today" || label === "Yesterday" ? label.toLowerCase() : `on ${label}`;
}