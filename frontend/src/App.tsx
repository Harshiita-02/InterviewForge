import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ComingSoon from "./pages/ComingSoon";
import Dashboard from "./pages/Dashboard";
import InterviewSetup from "./pages/interviewSetup";
import FocusLayout from "./components/FocusLayout";
import LiveInterview from "./pages/LiveInterview";
import Results from "./pages/Results";
import Progress from "./pages/Progress";
import Leaderboard from "./pages/Leaderboard";


export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<ComingSoon title="Dashboard" />} />
            <Route path="/resumes" element={<ComingSoon title="My Resumes" />} />
            <Route path="/progress" element={<ComingSoon title="Progress" />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<ComingSoon title="Settings" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/interview/setup" element={<InterviewSetup />} />
            <Route path="/progress" element={<Progress />} />
          </Route>

          <Route element={<FocusLayout />}>
            <Route path="/interview/:sessionId" element={<LiveInterview />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
