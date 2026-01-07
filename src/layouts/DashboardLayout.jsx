import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";
import HouseSwitcher from "../components/HouseSwitcher";
import { buildApiUrl, API_ENDPOINTS } from "../config/api";
import { applyTheme } from "../assets/themes";
import { 
  FaHome, 
  FaShoppingBag, 
  FaBed, 
  FaTrophy, 
  FaPhoneAlt,
  FaSignOutAlt,
  FaStore
} from "react-icons/fa";
import { GiCastle } from "react-icons/gi";

function DashboardLayout() {
  const navigate = useNavigate();

  // State setters only — values are not needed in this layout
  const [, setUserHouse] = useState(null);
  const [, setHouseName] = useState("");
  const [, setIsLoadingHouse] = useState(true);

  // Fetch user's house on mount
  useEffect(() => {
    const fetchUserHouse = async () => {
      try {
        console.log("🏠 Fetching user house...");
        const token = localStorage.getItem("jwt_token");

        if (!token) {
          console.error("❌ No JWT token found");
          setIsLoadingHouse(false);
          return;
        }

        console.log("🔑 Token found, calling API...");
        const response = await fetch(
          buildApiUrl(API_ENDPOINTS.SORTING_HAT_MY_HOUSE),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("📥 API Response Status:", response.status);
        const data = await response.json();
        console.log("📦 API Response Data:", data);

        if (data.status === "success" && data.data?.house) {
          const house =
            typeof data.data.house === "string"
              ? data.data.house.toLowerCase()
              : data.data.house.name?.toLowerCase();

          const name =
            typeof data.data.house === "string"
              ? data.data.house
              : data.data.house.name;

          console.log("✅ User house:", house, name);
          setUserHouse(house);
          setHouseName(name);

          applyTheme(house);
          console.log("🎨 Applied", house, "theme colors");
        } else {
          console.warn("⚠️ No house found in response:", data);
          applyTheme("hogwarts");
        }
      } catch (error) {
        console.error("❌ Failed to fetch user house:", error);
        applyTheme("hogwarts");
      } finally {
        setIsLoadingHouse(false);
      }
    };

    fetchUserHouse();
  }, []);

  const handleLogout = () => {
    // Clear all authentication and user data
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("parsec_cart");
    localStorage.removeItem("user_house");
    localStorage.removeItem("revelio_count");
    sessionStorage.clear(); // Clear session storage too (for admin tokens)
    
    // Force page reload to clear any cached state
    window.location.href = "/home";
  };

  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <nav className="dashboard-sidebar">
        <h3>Dashboard</h3>
        <HouseSwitcher />
        <ul className="dashboard-nav">
          <li>
            <Link className="dashboard-link" to="/dashboard">
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link className="dashboard-link" to="/dashboard/events">
              <GiCastle /> Events
            </Link>
          </li>
          <li>
            <Link className="dashboard-link" to="/dashboard/shop">
              <FaStore /> Shop
            </Link>
          </li>
          <li>
            <Link className="dashboard-link" to="/dashboard/orders">
              <FaShoppingBag /> Orders
            </Link>
          </li>
          <li>
            <Link className="dashboard-link" to="/dashboard/accommodation">
              <FaBed /> Accommodation
            </Link>
          </li>
          <li>
            <Link className="dashboard-link" to="/dashboard/leaderboard">
              <FaTrophy /> Leaderboard
            </Link>
          </li>
          <li>
            <Link className="dashboard-link" to="/dashboard/contact">
              <FaPhoneAlt /> Contact
            </Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
