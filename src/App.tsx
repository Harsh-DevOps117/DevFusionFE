"use client";
import { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import AdminRoute from "./components/AdminROUTE";
import ResumePivot from "./components/Interview/ResumeAnalysiss";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute"; // 🛡️ Added
import AdminDashboard from "./pages/AdminStats";
import CreateProblemPage from "./pages/CreateProblem";
import InterviewPage from "./pages/InterviewPage";
import LandingPage from "./pages/LandingPage";
import Leaderboard from "./pages/Leaderboard";
import PlaylistsPage from "./pages/PlaylistPage";
import ProblemsPage from "./pages/ProblemPage";
import ProblemSolvePage from "./pages/ProblemSolvePage";
import SubmissionsPage from "./pages/SubmissionPage";
import Userpage from "./pages/Userpages";
import McqPage from "./pages/questionPageMcq";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      {/* ⚡ Global Notification System */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />

      <div className="bg-[#0a0a0a] min-h-screen">
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<LandingPage />} />
          {/* --- PROTECTED USER ROUTES --- */}
          {/* In routes ke liye user ka logged-in hona zaroori hai */}{" "}
          <Route element={<ProtectedRoute />}>
            <Route path="/leader" element={<Leaderboard />} />
            <Route path="/profile" element={<Userpage />} />
            <Route path="/review" element={<ResumePivot />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/interview/:id" element={<InterviewPage />} />
            <Route path="/mcq" element={<McqPage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problem/:id" element={<ProblemSolvePage />} />
            <Route path="/submissions" element={<SubmissionsPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
          </Route>
          {/* --- PROTECTED ADMIN ROUTES --- */}
          {/* In routes ke liye user ka ADMIN hona zaroori hai */}
          <Route element={<AdminRoute />}>
            <Route path="/create-problem" element={<CreateProblemPage />} />
            <Route path="/stats" element={<AdminDashboard />} />
          </Route>
          {/* --- 404 HANDLER --- */}
          <Route
            path="*"
            element={
              <div className="h-screen flex items-center justify-center text-white font-machina-bold text-4xl">
                <NotFound />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
