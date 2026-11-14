import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import FocusLayout from "./components/FocusLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import InterviewSetup from "./pages/interviewSetup";
import LiveInterview from "./pages/LiveInterview";
import Results from "./pages/Results";
import Progress from "./pages/Progress";
import Leaderboard from "./pages/Leaderboard";
import MyResumes from "./pages/MyResumes";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Everything below needs a logged-in user */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/interview/setup" element={<InterviewSetup />} />
                <Route path="/results/:id" element={<Results />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/resumes" element={<MyResumes />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route element={<FocusLayout />}>
                <Route path="/interview/:sessionId" element={<LiveInterview />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}