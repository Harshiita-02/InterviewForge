import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, TrendingUp, Trophy, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/resumes", label: "My Resumes", icon: FileText },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-6 px-2 text-lg font-medium">
        <span className="text-[var(--text)]">Interview</span>
        <span className="text-[var(--accent)]">Forge</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm " +
              (isActive
                ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                : "text-[var(--muted)] hover:bg-[var(--bg)]")
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--bg)]"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}