import { useEffect, useState } from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { getCurrentUser, type CurrentUser } from "../services/authService";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const initial = user?.fullName.charAt(0).toUpperCase() ?? "";
  const iconBtn = "rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--bg)]";

  return (
    <header className="flex h-16 items-center justify-end gap-1 border-b border-[var(--border)] bg-[var(--surface)] px-6">
      <button onClick={toggleTheme} aria-label="Toggle theme" className={iconBtn}>
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </button>
      <button aria-label="Notifications" className={iconBtn}>
        <Bell size={18} />
      </button>
      <div className="ml-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-medium text-[var(--accent)]">
          {initial}
        </div>
        <span className="text-sm">{user?.fullName}</span>
      </div>
    </header>
  );
}