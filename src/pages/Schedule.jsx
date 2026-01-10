import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Particles from "../components/Particles";
import { useTheme } from "../context/ThemeContext";
import scheduleData from "../assets/data/schedule.json";
import "./Schedule.css";

gsap.registerPlugin(ScrollTrigger);

function Schedule() {
  const { theme } = useTheme();
  const [timeUntilParsec, setTimeUntilParsec] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const journeyRef = useRef(null);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const heroRef = useRef(null);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sort events by date and apply alternating positioning
  const events = [...scheduleData.preliminaryEvents]
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .map((event, index) => ({
      ...event,
      position: index % 2 === 0 ? "above" : "below",
    }));

  useEffect(() => {
    // Calculate time until Parsec main event (Jan 23, 2026 at 10:00 AM)
    const updateCountdown = () => {
      const parsecDate = new Date("2026-01-23T10:00:00");
      const now = new Date();
      const diffTime = parsecDate - now;

      if (diffTime > 0) {
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        setTimeUntilParsec({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Skip Locomotive Scroll and GSAP horizontal scroll on mobile
    if (isMobile) return;

    let scroll = null;
    let handleResize = null;
    const refreshTimeouts = [];

    // Add delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      // Initialize Locomotive Scroll
      scroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        multiplier: 0.8,
        lerp: 0.1,
        smartphone: {
          smooth: true,
        },
        tablet: {
          smooth: true,
        },
      });

      // Expose scroll instance to window for ScrollToTopButton
      window.locomotive = scroll;

      // Update ScrollTrigger when Locomotive Scroll updates
      scroll.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(scrollRef.current, {
        scrollTop(value) {
          return arguments.length
            ? scroll.scrollTo(value, 0, 0)
            : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: scrollRef.current.style.transform ? "transform" : "fixed",
      });

      // Force Locomotive to update its internal calculations
      scroll.update();

      // Hero zoom effect on scroll
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          scale: 1.15,
          opacity: 0.7,
          filter: "blur(3px)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            scroller: scrollRef.current,
          },
        });
      }

      // GSAP Horizontal Scroll Animation
      if (journeyRef.current && containerRef.current) {
        const journey = journeyRef.current;
        const container = containerRef.current;

        const numEvents = events.length;
        const eventSpacing = 350;
        const startPadding = 300;
        const destinationSpace = 600;
        const scrollWidth =
          startPadding + numEvents * eventSpacing + destinationSpace;

        gsap.to(container, {
          x: -scrollWidth + window.innerWidth,
          ease: "none",
          scrollTrigger: {
            trigger: journey,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            scroller: scrollRef.current,
          },
        });
      }

      // Multiple refresh attempts at staggered intervals
      const refreshDelays = [0, 100, 300, 500, 1000];
      refreshDelays.forEach((delay) => {
        const timeoutId = setTimeout(() => {
          scroll.update();
          ScrollTrigger.refresh();
        }, delay);
        refreshTimeouts.push(timeoutId);
      });

      // Handle window resize
      handleResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(initTimeout);
      refreshTimeouts.forEach((id) => clearTimeout(id));
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      if (scroll) {
        scroll.destroy();
        // Clean up window reference
        delete window.locomotive;
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [events.length, isMobile]);

  return (
    <>
      {/* Particles OUTSIDE scroll container - truly fixed to viewport */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
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
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Scroll container */}
      <div className="schedule-page" ref={scrollRef} data-scroll-container>
        <Navbar />

        {/* Hero Section - Vertical Scroll */}
        <section className="schedule-hero" ref={heroRef}>
          <div className="hero-content">
            <div className="train-container">
              <div className="train-svg">
                {/* Simple train SVG */}
                <svg viewBox="0 0 200 100" className="hogwarts-express">
                  <g className="train-body">
                    {/* Engine */}
                    <rect
                      x="10"
                      y="40"
                      width="40"
                      height="30"
                      fill="var(--fontAccent)"
                      rx="3"
                    />
                    <rect
                      x="15"
                      y="30"
                      width="30"
                      height="15"
                      fill="var(--fontAccent)"
                      rx="2"
                    />
                    {/* Cabin */}
                    <rect
                      x="55"
                      y="35"
                      width="50"
                      height="35"
                      fill="var(--surface)"
                      stroke="var(--fontAccent)"
                      strokeWidth="2"
                      rx="3"
                    />
                    <rect
                      x="60"
                      y="40"
                      width="18"
                      height="15"
                      fill="var(--fontMain)"
                      opacity="0.3"
                      rx="1"
                    />
                    <rect
                      x="82"
                      y="40"
                      width="18"
                      height="15"
                      fill="var(--fontMain)"
                      opacity="0.3"
                      rx="1"
                    />
                    {/* Wheels */}
                    <circle
                      cx="25"
                      cy="72"
                      r="8"
                      fill="var(--fontMain)"
                      stroke="var(--fontAccent)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="45"
                      cy="72"
                      r="8"
                      fill="var(--fontMain)"
                      stroke="var(--fontAccent)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="70"
                      cy="72"
                      r="8"
                      fill="var(--fontMain)"
                      stroke="var(--fontAccent)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="90"
                      cy="72"
                      r="8"
                      fill="var(--fontMain)"
                      stroke="var(--fontAccent)"
                      strokeWidth="2"
                    />
                    {/* Steam */}
                    <circle
                      className="steam steam-1"
                      cx="8"
                      cy="25"
                      r="5"
                      fill="var(--fontMain)"
                      opacity="0.4"
                    />
                    <circle
                      className="steam steam-2"
                      cx="5"
                      cy="15"
                      r="7"
                      fill="var(--fontMain)"
                      opacity="0.3"
                    />
                    <circle
                      className="steam steam-3"
                      cx="12"
                      cy="10"
                      r="6"
                      fill="var(--fontMain)"
                      opacity="0.2"
                    />
                  </g>
                </svg>
              </div>
            </div>

            <div className="hero-text">
              <h1 className="hero-title">Board the <span>Hogwarts Express</span></h1>
              <p className="hero-description">
                Embark on a mystical journey through time as we trace the path
                to Parsec 6.0. From preliminary challenges to the grand
                celebration, every station marks a milestone in our quest for
                innovation and excellence.
              </p>
              <div className="countdown-box">
                <div className="countdown-grid">
                  <div className="countdown-item">
                    <div className="countdown-number">
                      {timeUntilParsec.days}
                    </div>
                    <div className="countdown-label">Days</div>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <div className="countdown-number">
                      {String(timeUntilParsec.hours).padStart(2, "0")}
                    </div>
                    <div className="countdown-label">Hours</div>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <div className="countdown-number">
                      {String(timeUntilParsec.minutes).padStart(2, "0")}
                    </div>
                    <div className="countdown-label">Minutes</div>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <div className="countdown-number">
                      {String(timeUntilParsec.seconds).padStart(2, "0")}
                    </div>
                    <div className="countdown-label">Seconds</div>
                  </div>
                </div>
                <div className="countdown-date">
                  23rd - 27th January 2026 • Starts at 10:00 AM
                </div>
              </div>
            </div>

            {/* Scroll Indicator - only show on desktop */}
            {!isMobile && (
              <div className="scroll-indicator">
                <div className="scroll-icon">
                  <div className="scroll-wheel"></div>
                </div>
                <p className="scroll-text">Scroll to move the train</p>
                <div className="scroll-arrow">↓</div>
              </div>
            )}
          </div>
        </section>

        {/* Mobile: Vertical Timeline */}
        {isMobile ? (
          <section className="schedule-mobile-timeline">
            <h2 className="timeline-header">Event Timeline</h2>
            <div className="mobile-timeline">
              {/* Vertical line */}
              <div className="timeline-line"></div>

              {/* Event Cards */}
              {events.map((event, index) => (
                <div key={event.id} className="mobile-event-item">
                  <div className="timeline-node"></div>
                  <div className="mobile-event-card">
                    <h3 className="event-name">{event.name}</h3>
                    <div className="event-dates">
                      <div className="date-item">
                        <span className="date-icon">📅</span>
                        <span className="date-label">Start</span>
                        <span className="date-value">
                          {new Date(event.startDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                            }
                          )}
                        </span>
                      </div>
                      <div className="date-item">
                        <span className="date-icon">📤</span>
                        <span className="date-label">Deadline</span>
                        <span className="date-value">
                          {new Date(
                            event.submissionDeadline
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className={`event-status status-${event.status}`}>
                      {event.status}
                    </div>
                  </div>
                </div>
              ))}

              {/* Destination - Main Event */}
              <div className="mobile-event-item destination">
                <div className="timeline-node destination-node"></div>
                <div className="mobile-destination-card">
                  <div className="castle-icon">🏰</div>
                  <h2 className="destination-title">PARSEC 6.0</h2>
                  <p className="destination-dates">23rd - 27th January 2026</p>

                  <div className="main-week-preview-mobile">
                    {scheduleData.mainEvent.days.map((day) => (
                      <div key={day.day} className="day-card">
                        <div className="day-number">Day {day.day}</div>
                        <div className="day-date">
                          {new Date(day.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </div>
                        <div className="day-placeholder">Schedule TBA</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* Desktop: Horizontal Journey Section */
          <section className="schedule-journey" ref={journeyRef}>
            <div className="journey-container" ref={containerRef}>
              <div className="track-background">
                {/* Railroad track */}
                <div className="railroad-track" style={{ zIndex: 1 }}>
                  <div className="rail rail-top" style={{ zIndex: 1 }}></div>
                  <div className="rail rail-bottom" style={{ zIndex: 1 }}></div>
                  <div className="sleepers" style={{ zIndex: 1 }}>
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div
                        key={i}
                        className="sleeper"
                        style={{ left: `${i * 50}px` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Event Stations */}
                <div className="event-stations" style={{ zIndex: 2 }}>
                  {events.map((event, index) => {
                    const startPadding = 300;
                    const eventSpacing = 350;
                    const leftPosition = startPadding + index * eventSpacing;
                    return (
                      <div
                        key={event.id}
                        className={`event-station ${event.position}`}
                        style={{ left: `${leftPosition}px` }}
                      >
                        {/* Station Node */}
                        <div className="station-node"></div>

                        {/* Event Card */}
                        <div className="event-card">
                          <h3 className="event-name">{event.name}</h3>
                          <div className="event-dates">
                            <div className="date-item">
                              <span className="date-icon">📅</span>
                              <span className="date-label">Start</span>
                              <span className="date-value">
                                {new Date(event.startDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="date-item">
                              <span className="date-icon">📤</span>
                              <span className="date-label">Deadline</span>
                              <span className="date-value">
                                {new Date(
                                  event.submissionDeadline
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                })}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`event-status status-${event.status}`}
                          >
                            {event.status}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Destination - Main Event */}
                  <div
                    className="destination-station"
                    style={{
                      left: `${450 + events.length * 350}px`,
                    }}
                  >
                    <div className="destination-marker">
                      <div className="castle-icon">🏰</div>
                      <h2 className="destination-title">PARSEC 6.0</h2>
                      <p className="destination-dates">
                        23rd - 27th January 2026
                      </p>

                      <div className="main-week-preview">
                        {scheduleData.mainEvent.days.map((day) => (
                          <div key={day.day} className="day-card">
                            <div className="day-number">Day {day.day}</div>
                            <div className="day-date">
                              {new Date(day.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </div>
                            <div className="day-placeholder">Schedule TBA</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
}

export default Schedule;
