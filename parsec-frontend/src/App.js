import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';

// Import page components (we'll create these next)
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignupLayout from './pages/signup/SignupLayout';
import Onboarding from './pages/signup/Onboarding';
import Terms from './pages/signup/Terms';
import Auth from './pages/signup/Auth';
import ManualAuth from './pages/signup/ManualAuth';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Schedule from './pages/Schedule';
import Team from './pages/Team';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardEvents from './pages/dashboard/DashboardEvents';
import DashboardEventDetail from './pages/dashboard/DashboardEventDetail';
import DashboardSchedule from './pages/dashboard/DashboardSchedule';
import Tickets from './pages/dashboard/Tickets';
import Profile from './pages/dashboard/Profile';
import Leaderboard from './pages/dashboard/Leaderboard';
import DashboardTeam from './pages/dashboard/Team';
import Contact from './pages/dashboard/Contact';
import NotFound from './pages/NotFound';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Root redirects to landing */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Public Routes */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Signup Flow (nested routes) */}
        <Route path="/signup" element={<SignupLayout />}>
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="auth" element={<Auth />} />
          <Route path="manual" element={<ManualAuth />} />
          <Route path="terms" element={<Terms />} />
        </Route>

        {/* Public Events, Schedule & Team */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/team" element={<Team />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="events" element={<DashboardEvents />} />
          <Route path="events/:id" element={<DashboardEventDetail />} />
          <Route path="schedule" element={<DashboardSchedule />} />
          <Route path="tickets" element={<Tickets />} />
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
  return (
    <Router>
      <ThemeProvider>
        <AnimatedRoutes />
      </ThemeProvider>
    </Router>
  );
}

export default App;