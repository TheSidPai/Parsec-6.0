import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import MagicalLoader from "./components/MagicalLoader";
import ScrollToTopButton from "./components/ScrollToTopButton";

// Import page components
import Home from "./pages/Home";
import Events from "./pages/Events";
import Harshtal from "./pages/Harshtal";
import Tesseract from "./pages/Tesseract";
import EventDetail from "./pages/EventDetail";
import Schedule from "./pages/Schedule";
import Team from "./pages/Team";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardEvents from "./pages/dashboard/DashboardEvents";
import DashboardEventDetail from "./pages/dashboard/DashboardEventDetail";
import DashboardSchedule from "./pages/dashboard/DashboardSchedule";
import Profile from "./pages/dashboard/Profile";
import Leaderboard from "./pages/dashboard/Leaderboard";
import DashboardTeam from "./pages/dashboard/Team";
import Contact from "./pages/dashboard/Contact";
import Orders from "./pages/dashboard/Orders";
import Accommodation from "./pages/dashboard/Accommodation";
import NotFound from "./pages/NotFound";
import HousePage from "./pages/HousePage";
import AdminAuth from "./components/admin/AdminAuth";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AuthComingSoon from "./pages/AuthComingSoon";
import AccommodationComingSoon from "./pages/AccommodationComingSoon";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/landing" element={<Navigate to="/home" replace />} />

        {/* Auth (Coming Soon) */}
        <Route path="/login" element={<AuthComingSoon />} />
        <Route path="/signup/*" element={<AuthComingSoon />} />

        {/* Public Pages */}
        <Route path="/events" element={<Events />} />
        <Route path="/harshtal" element={<Harshtal />} />
        <Route path="/tesseract" element={<Tesseract />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/team" element={<Team />} />
        <Route path="/accommodation" element={<AccommodationComingSoon />} />

        {/* House Pages */}
        <Route path="/house/:houseName" element={<HousePage />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminAuth />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="events" element={<DashboardEvents />} />
          <Route path="events/:id" element={<DashboardEventDetail />} />
          <Route path="schedule" element={<DashboardSchedule />} />
          <Route path="orders" element={<Orders />} />
          <Route path="accommodation" element={<Accommodation />} />
          <Route path="profile" element={<Profile />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="team" element={<DashboardTeam />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const handleLoadComplete = () => {
    setIsLoading(false);
    setHasLoadedOnce(true);
    sessionStorage.setItem("hasLoadedOnce", "true");
  };

  return (
    <Router>
      <ThemeProvider>
        {/* Initial magical loader */}
        {isLoading && !hasLoadedOnce && (
          <MagicalLoader onLoadComplete={handleLoadComplete} />
        )}

        {/* Main app */}
        <div
          style={{
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.5s ease-in",
          }}
        >
          <AnimatedRoutes />
        </div>

        {/* GLOBAL SCROLL TO TOP BUTTON */}
        <ScrollToTopButton />
      </ThemeProvider>
    </Router>
  );
}

export default App;
