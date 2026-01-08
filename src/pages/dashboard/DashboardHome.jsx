import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, authenticatedFetch } from "../../config/api";
import eventsData from "../../assets/data/events.json";
import Lightning from "../../components/Lightning";
// import FuzzyText from '../../components/FuzzyText';
import { gsap } from "gsap";
import "./DashboardHome.css";
import { 
  FaTrophy, 
  FaShoppingBag, 
  FaCalendarAlt,
  FaCrown,
  FaMagic
} from "react-icons/fa";
import { 
  GiCastle, 
  GiLion, 
  GiSnakeTongue, 
  GiEagleHead, 
  GiHoneypot,
  GiCrystalBall 
} from "react-icons/gi";

function DashboardHome() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");
  const textRef = useRef(null);

  // Check if animations have been shown before (allow 3 times for better UX)
  const [showLightning, setShowLightning] = useState(() => {
    const viewCount = parseInt(localStorage.getItem('revelio_count') || '0');
    return viewCount < 3; // Show for first 3 visits
  });
  const [showGlitchText, setShowGlitchText] = useState(false);
  const [showDashboard, setShowDashboard] = useState(() => {
    const viewCount = parseInt(localStorage.getItem('revelio_count') || '0');
    return viewCount >= 3; // Skip animation after 3 views
  });

  const [userData, setUserData] = useState({
    name: "Student",
    house: null,
    housePoints: 0,
    rank: "Coming Soon",
  });

  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  const houseIcons = {
    gryffindor: <GiLion />,
    slytherin: <GiSnakeTongue />,
    ravenclaw: <GiEagleHead />,
    hufflepuff: <GiHoneypot />,
    hogwarts: <GiCastle />,
  };

  const getHouseIcon = (houseName) => {
    if (!houseName) return <GiCastle />;
    return houseIcons[houseName.toLowerCase()] || <GiCastle />;
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Check view count
    const viewCount = parseInt(localStorage.getItem('revelio_count') || '0');
    
    // Skip animation if already shown 3 times
    if (viewCount >= 3) {
      const sidebar = document.querySelector(".dashboard-sidebar");
      if (sidebar) sidebar.style.display = "block";
      return;
    }

    // Hide sidebar during intro
    const sidebar = document.querySelector(".dashboard-sidebar");
    if (sidebar) sidebar.style.display = "none";

    // Track timeouts for cleanup
    const timeouts = [];
    let glowAnimation = null;
    let exitAnimation = null;
    let crystallizeAnimation = null;

    // Text appears at 1.4s with 3D crystallization effect
    timeouts.push(setTimeout(() => {
      console.log("✨ Text crystallizing now!");
      setShowGlitchText(true);

      // Wait for next frame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (!textRef.current) {
          console.warn("⚠️ textRef not ready, skipping animation");
          return;
        }

        console.log("🎬 GSAP 3D crystallization starting");
        
        // 1.4s → 1.95s: Crystallize from depth (550ms)
        crystallizeAnimation = gsap.fromTo(
          textRef.current,
          { 
            opacity: 0, 
            scale: 0.92,
            rotateY: -8,
            y: 20  // Starts 20px below - materializing from lightning
          },
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            y: 0,  // Drifts to center position
            duration: 0.55,
            ease: "power2.out",
          }
        );

        // 1.6s: Glow pulse (200ms flash) - "spell locks in"
        timeouts.push(setTimeout(() => {
          if (!textRef.current) return;
          console.log("⚡ Glow pulse!");
          glowAnimation = gsap.to(textRef.current, {
            textShadow: `
              0 0 24px rgba(255, 255, 255, 0.5),
              0 0 48px rgba(255, 215, 100, 0.4),
              0 0 80px rgba(255, 215, 100, 0.2)
            `,
            duration: 0.2,
            yoyo: true,
            repeat: 1
          });
        }, 200));

        // 1.95s → 2.5s: Clean exit (500ms)
        timeouts.push(setTimeout(() => {
          if (!textRef.current) return;
          console.log("➡️ Text exiting elegantly");
          exitAnimation = gsap.to(textRef.current, {
            x: -50,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        }, 550));
      });
    }, 1400));

    // Everything ends at 2.5s, dashboard appears smoothly
    timeouts.push(setTimeout(() => {
      setShowLightning(false);
      setShowGlitchText(false);
      setShowDashboard(true);
      
      // Increment view count
      const viewCount = parseInt(localStorage.getItem('revelio_count') || '0');
      localStorage.setItem('revelio_count', (viewCount + 1).toString());
      
      if (sidebar) {
        sidebar.style.display = "block";
        // Smooth fade in for sidebar
        gsap.fromTo(sidebar, { opacity: 0 }, { opacity: 1, duration: 0.6 });
      }
    }, 2500));

    // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      if (crystallizeAnimation) crystallizeAnimation.kill();
      if (glowAnimation) glowAnimation.kill();
      if (exitAnimation) exitAnimation.kill();
      if (sidebar) sidebar.style.display = "block";
    };
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.warn("⚠️ DEV MODE: No token - using default data");
        setLoading(false);
        return;
      }

      try {
        const { response, data } = await authenticatedFetch(
          API_ENDPOINTS.SORTING_HAT_MY_HOUSE,
          { method: "GET" },
          token
        );

        if (response.ok && data.data?.house) {
          const houseName = data.data.house.name;
          setUserData((prev) => ({
            ...prev,
            name: data.data.name || "Student",
            house: houseName.toLowerCase(),
            rank: "Coming Soon",
          }));
        }
      } catch (e) {
        console.error("User fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="dashboard-home">
        <div className="loading-skeleton">
          <div className="skeleton-welcome"></div>
          <div className="skeleton-stats">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-home" data-house={userData.house}>
      {/* Lightning Animation with Background Image */}
      {showLightning && (
        <div className="intro-animation-overlay">
          <Lightning
            hue={
              userData.house === "gryffindor"
                ? 0
                : userData.house === "slytherin"
                ? 120
                : userData.house === "ravenclaw"
                ? 220
                : userData.house === "hufflepuff"
                ? 50
                : 220
            }
            xOffset={0}
            speed={1.5}
            intensity={1.2}
            size={1}
          />
          {/* Spell Text "Revelio" */}
          {showGlitchText && (
            <div className="spell-text-container">
              <div ref={textRef} className="spell-text classic">
                Revelio
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dashboard Content */}
      {showDashboard && (
        <div className="dashboard-content-wrapper">
          {/* House Rank */}
          <div className="quick-info-bar">
            <div className="info-item">
              <span className="info-icon"><FaCrown /></span>
              <span className="info-text">House Rank: {userData.rank} / 4</span>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="welcome-greeting">
              {greeting}, {userData.name}! <FaMagic className="greeting-icon" />
            </h1>
            <p className="welcome-subtext">
              Your magical journey continues at Parsec 2026
            </p>

            {userData.house && (
              <div className="house-badge">
                <span className="house-badge-icon">
                  {getHouseIcon(userData.house)}
                </span>
                <span>
                  House{" "}
                  {userData.house.charAt(0).toUpperCase() +
                    userData.house.slice(1)}
                </span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-divider left"></div>
                <h3 className="stat-title">Total Events</h3>
                <div className="stat-divider right"></div>
              </div>
              <div className="stat-value">{eventsData.length}</div>
              <button 
                className="stat-btn"
                onClick={() => navigate("/dashboard/events")}
              >
                Explore Events
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-divider left"></div>
                <h3 className="stat-title">House Points</h3>
                <div className="stat-divider right"></div>
              </div>
              <div className="stat-value">0</div>
              <button 
                className="stat-btn"
                onClick={() => navigate("/dashboard/leaderboard")}
              >
                View Leaderboard
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-divider left"></div>
                <h3 className="stat-title">My Orders</h3>
                <div className="stat-divider right"></div>
              </div>
              <div className="stat-value">0</div>
              <button 
                className="stat-btn"
                onClick={() => navigate("/dashboard/orders")}
              >
                Track Purchases
              </button>
            </div>
          </div>

          {/* Single Column Content */}
          <div className="dashboard-content-section">
            {/* Quick Actions */}
            <div className="quick-actions">
              <h2 className="section-title">Quick Actions</h2>
              <div className="actions-grid">
                <button
                  className="action-btn"
                  onClick={() => navigate("/dashboard/events")}
                >
                  <span className="action-icon"><GiCastle /></span>
                  <span>Browse Events</span>
                </button>

                <button
                  className="action-btn"
                  onClick={() => navigate("/dashboard/orders")}
                >
                  <span className="action-icon"><FaShoppingBag /></span>
                  <span>My Orders</span>
                </button>

                <button
                  className="action-btn"
                  onClick={() => navigate("/dashboard/leaderboard")}
                >
                  <span className="action-icon"><FaTrophy /></span>
                  <span>Leaderboard</span>
                </button>

                <button
                  className="action-btn"
                  onClick={() => navigate("/dashboard/schedule")}
                >
                  <span className="action-icon"><FaCalendarAlt /></span>
                  <span>Schedule</span>
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="upcoming-events">
              <h2 className="section-title">Upcoming Events</h2>
              <div className="event-list">
                {eventsData
                  .filter((event) => {
                    const dateMatch = event.date.match(
                      /([A-Za-z]+)\s+(\d+),\s+(\d{4})/
                    );
                    if (dateMatch) {
                      const [, month, day, year] = dateMatch;
                      const eventDate = new Date(`${month} ${day}, ${year}`);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return (
                        eventDate >= today ||
                        (today - eventDate) / (1000 * 60 * 60 * 24) < 60
                      );
                    }
                    return true;
                  })
                  .slice(0, 5)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="event-item"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <div className="event-info">
                        <h3>{event.title}</h3>
                        <p>
                          <FaCalendarAlt className="event-date-icon" /> {event.date} • {event.category}
                        </p>
                      </div>
                      <div className="event-badge">VIEW</div>
                    </div>
                  ))}

                {eventsData.length === 0 && (
                  <div className="no-events">
                    <p><GiCrystalBall /> More events will appear here as they're announced</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardHome;
