import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function FocusLayout() {
  const { theme } = useTheme();
  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Outlet />
    </div>
  );
}