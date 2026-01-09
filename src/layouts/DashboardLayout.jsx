import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import "./DashboardLayout.css";
import Particles from "../components/Particles";
import { useTheme } from "../context/ThemeContext";
// import HouseSwitcher from "../components/HouseSwitcher"; // Commented out - testing feature only
import { buildApiUrl, API_ENDPOINTS } from "../config/api";
import { applyTheme } from "../assets/themes";
import { 
  FaHome, 
  FaShoppingBag, 
  FaBed, 
  FaTrophy, 
  FaSignOutAlt,
  FaStore
} from "react-icons/fa";
import { GiCastle } from "react-icons/gi";

function DashboardLayout() {
  const { theme } = useTheme();

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

        let house = null;
        let name = "";

        // Check for both 'success' and 'status' fields
        if ((data.success === true || data.status === "success") && data.data) {
          // Case 1: house is in data.data.house (object with name property)
          if (data.data.house && typeof data.data.house === "object" && data.data.house.name) {
            house = data.data.house.name.toLowerCase();
            name = data.data.house.name;
          }
          // Case 2: house is a string directly in data.data.house
          else if (data.data.house && typeof data.data.house === "string") {
            house = data.data.house.toLowerCase();
            name = data.data.house;
          }
          // Case 3: house name is in data.data.houseName
          else if (data.data.houseName && typeof data.data.houseName === "string") {
            house = data.data.houseName.toLowerCase();
            name = data.data.houseName;
          }
          // Case 4: house is directly in data.data as a string
          else if (typeof data.data === "string") {
            house = data.data.toLowerCase();
            name = data.data;
          }
        }

        if (house) {
          console.log("✅ User house:", house, name);
          setUserHouse(house);
          setHouseName(name);
          applyTheme(house);
          console.log("🎨 Applied", house, "theme colors");
        } else {
          console.warn("⚠️ No house found in response:", data);
          console.log("Available keys in data.data:", data.data ? Object.keys(data.data) : "No data.data");
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
      {/* Particles Background - Only visible on mobile */}
      <div className="dashboard-particles-bg">
        <Particles
          particleColors={[
            theme.fontMain || "#ffffff",
            theme.fontMain || "#ffffff",
          ]}
          particleCount={400}
          particleSpread={15}
          speed={0.1}
          particleBaseSize={70}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Sidebar */}
      <nav className="dashboard-sidebar">
        <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>PARSEC</h3>
        </Link>
        {/* <HouseSwitcher /> */} {/* Commented out - testing feature only */}
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
          {/* <li>
            <Link className="dashboard-link" to="/dashboard/contact">
              <FaPhoneAlt /> Contact
            </Link>
          </li> */}
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
