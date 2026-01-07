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

// Import page components
import Home from "./pages/Home";
import Events from "./pages/Events";
import Harshtal from "./pages/Harshtal";
import Tesseract from "./pages/Tesseract";
import EventDetail from "./pages/EventDetail";
import Schedule from "./pages/Schedule";
import Team from "./pages/Team";
import Login from "./pages/Login";
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
import Shop from "./pages/dashboard/Shop";
import Cart from "./pages/dashboard/Cart";
import Checkout from "./pages/dashboard/Checkout";
import PaymentHistory from "./pages/dashboard/PaymentHistory";
import Passes from "./pages/dashboard/Passes";
import PassCheckout from "./pages/dashboard/PassCheckout";
import PublicAccommodation from "./pages/Accommodation";
import NotFound from "./pages/NotFound";
import HousePage from "./pages/HousePage";
import AdminAuth from "./components/admin/AdminAuth";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import Onboarding from "./pages/signup/Onboarding";
import SortingHat from "./pages/signup/SortingHat";
import Auth from "./pages/signup/Auth";
import ManualToken from "./pages/signup/ManualToken";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Root redirects to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public Routes */}
        <Route path="/home" element={<Home />} />

        <Route path="/landing" element={<Navigate to="/home" replace />} />

        {/* Auth (Coming Soon) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup/auth" element={<Auth />} />
        <Route path="/signup/manual-token" element={<ManualToken />} />
        <Route path="/signup/onboarding" element={<Onboarding />} />
        <Route path="/signup/sorting" element={<SortingHat />} />
        <Route path="/signup/*" element={<Login />} />

        {/* Public Events, Schedule & Team */}
        <Route path="/events" element={<Events />} />
        <Route path="/harshtal" element={<Harshtal />} />
        <Route path="/tesseract" element={<Tesseract />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/team" element={<Team />} />
        <Route path="/accommodation" element={<PublicAccommodation />} />

        {/* House-Specific Pages (Protected) */}
        <Route path="/house/:houseName" element={<HousePage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminAuth />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="events" element={<DashboardEvents />} />
          <Route path="events/:id" element={<DashboardEventDetail />} />
          <Route path="schedule" element={<DashboardSchedule />} />
          <Route path="shop" element={<Shop />} />
          <Route path="passes" element={<Passes />} />
          <Route path="pass-checkout" element={<PassCheckout />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payment-history" element={<PaymentHistory />} />
          <Route path="accommodation" element={<Accommodation />} />
          <Route path="profile" element={<Profile />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="team" element={<DashboardTeam />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* 404 Page */}
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
    // Store in session storage so loader doesn't show again during this session
    sessionStorage.setItem("hasLoadedOnce", "true");
  };

  return (
    <Router>
      <ThemeProvider>
        {/* Show loader only on first load */}
        {isLoading && !hasLoadedOnce && (
          <MagicalLoader onLoadComplete={handleLoadComplete} />
        )}

        {/* Main app content */}
        <div
          style={{
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.5s ease-in",
          }}
        >
          <AnimatedRoutes />
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
