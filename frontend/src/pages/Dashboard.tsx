import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, type CurrentUser } from "../services/authService";
import { getDashboardData } from "../services/dashboardService";
import type { DashboardData } from "../types/dashboard";
import { getGreeting } from "../utils/dashboard";
import StatStrip from "../components/dashboard/StatStrip";
import SuggestionCard from "../components/dashboard/SuggestionCard";
import RecentSessions from "../components/dashboard/RecentSessions";

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xs text-[var(--muted)]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCurrentUser(), getDashboardData()])
      .then(([u, d]) => {
        setUser(u);
        setData(d);
      })
      .catch(() => setError("Couldn't load your dashboard. Please refresh."));
  }, []);

  if (error) return <p className="text-sm text-[var(--bad)]">{error}</p>;
  if (!user || !data) return <p className="text-sm text-[var(--muted)]">Loading…</p>;

  const firstName = user.fullName.split(" ")[0];
  const startInterview = () => navigate("/interview/setup");

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[21px] font-medium">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-1 text-[13px] text-[var(--muted)]">Practice. Improve. Get Hired.</p>
        </div>
        <button
          onClick={startInterview}
          className="h-[38px] shrink-0 rounded-lg bg-[var(--accent)] px-4 text-[13px] font-medium text-white"
        >
          Start New Interview
        </button>
      </div>

      <Section title="Your progress">
        <StatStrip stats={data.stats} />
      </Section>

      {data.suggestion && (
        <Section title="Suggested for you">
          <SuggestionCard suggestion={data.suggestion} onStart={startInterview} />
        </Section>
      )}

      <Section
        title="Recent sessions"
        action={
          <Link to="/progress" className="text-xs font-medium text-[var(--accent)]">
            View all
          </Link>
        }
      >
        <RecentSessions sessions={data.recentSessions} />
      </Section>
    </div>
  );
}