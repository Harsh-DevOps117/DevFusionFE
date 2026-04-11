import { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import ResumePivot from "./components/Interview/ResumeAnalysiss";
import NotFound from "./components/NotFound";
import InterviewPage from "./pages/InterviewPage";
import LandingPage from "./pages/LandingPage";
import Leaderboard from "./pages/Leaderboard";
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
      <div className="bg-[#0a0a0a] min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<Userpage />} />
          <Route path="/review" element={<ResumePivot />}></Route>
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/interview/:id" element={<InterviewPage />} />
          <Route path="/mcq" element={<McqPage></McqPage>}></Route>
          <Route path="/leader" element={<Leaderboard></Leaderboard>}></Route>
          {/* Example Placeholder for future pages:
            //
            <Route path="/courses" element={<Courses />} />
          */}
          <Route
            path="*"
            element={
              <div className="h-screen flex items-center justify-center text-white font-machina-bold text-4xl">
                <NotFound></NotFound>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
