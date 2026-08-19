import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ScrollToTopButton.css";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isSchedulePage = location.pathname === "/schedule";

  useEffect(() => {
    let locomotiveScroll = null;
    let scrollContainer = null;

    const toggleVisibility = () => {
      // For Schedule page with Locomotive Scroll
      if (isSchedulePage) {
        scrollContainer = document.querySelector("[data-scroll-container]");
        if (scrollContainer) {
          // Check if scrollContainer has scrollTop property (mobile/normal scroll)
          const scrollPosition = scrollContainer.scrollTop || 0;
          setIsVisible(scrollPosition > 300);
        }
      } else {
        // For regular pages
        if (window.scrollY > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    if (isSchedulePage) {
      // Wait for Locomotive Scroll to initialize
      const checkInterval = setInterval(() => {
        scrollContainer = document.querySelector("[data-scroll-container]");
        if (scrollContainer) {
          clearInterval(checkInterval);

          // Listen to Locomotive Scroll events
          const locomotiveScrollEvent = (e) => {
            const scrollY = e.scroll?.y || 0;
            setIsVisible(scrollY > 300);
          };

          // Try to get Locomotive Scroll instance from window
          if (window.locomotive) {
            window.locomotive.on("scroll", locomotiveScrollEvent);
            locomotiveScroll = window.locomotive;
          }

          // Also add regular scroll listener as fallback for mobile
          scrollContainer.addEventListener("scroll", toggleVisibility);
        }
      }, 100);

      // Cleanup interval after 5 seconds
      setTimeout(() => clearInterval(checkInterval), 5000);

      return () => {
        clearInterval(checkInterval);
        if (locomotiveScroll) {
          locomotiveScroll.off("scroll");
        }
        if (scrollContainer) {
          scrollContainer.removeEventListener("scroll", toggleVisibility);
        }
      };
    } else {
      // Regular scroll listener for other pages
      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
    }
  }, [isSchedulePage]);

  const scrollToTop = () => {
    if (isSchedulePage) {
      const scrollContainer = document.querySelector("[data-scroll-container]");

      // Check if Locomotive Scroll is active
      if (window.locomotive) {
        window.locomotive.scrollTo(0, {
          duration: 800,
          easing: [0.25, 0.0, 0.35, 1.0],
        });
      } else if (scrollContainer) {
        // Fallback for mobile/regular scroll
        scrollContainer.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } else {
      // Regular scroll for other pages
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      className={`scroll-to-top ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

export default ScrollToTopButton;
