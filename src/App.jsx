import { Navigate, Route, Routes } from "react-router";
import BottomNav from "./components/BottomNav.jsx";
import Admin from "./pages/Admin.jsx";
import History from "./pages/History.jsx";
import Home from "./pages/Home.jsx";
import NewEstimate from "./pages/NewEstimate.jsx";
import Summary from "./pages/Summary.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estimate/new" element={<NewEstimate />} />
        <Route path="/estimate/summary" element={<Summary mode="current" />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:projectId" element={<Summary mode="project" />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

