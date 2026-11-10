import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import TopBar from "./TopBar";
import { useTheme } from "../context/ThemeContext";

export default function AppLayout() {
  const { theme } = useTheme();

  return (
    <div data-theme={theme} className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}