import { useEffect, useRef, useState } from 'react';

/**
 * Hook to detect when an element enters/exits the viewport during scroll
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Percentage of element visible to trigger (0-1)
 * @param {string} options.triggerOnce - Only trigger animation once
 * @returns {Object} { ref, isInView, hasTriggered }
 */
export const useScrollTrigger = (options = {}) => {
  const { threshold = 0.3, triggerOnce = false } = options;
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate if element is in viewport
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      const elementHeight = rect.height;
      
      // Check if threshold of element is visible
      const visibleHeight = Math.min(elementBottom, windowHeight) - Math.max(elementTop, 0);
      const visiblePercentage = visibleHeight / elementHeight;
      
      const nowInView = visiblePercentage >= threshold;
      
      if (nowInView && !hasTriggered) {
        setIsInView(true);
        setHasTriggered(true);
      } else if (!triggerOnce) {
        setIsInView(nowInView);
      }
    };

    // Check initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [threshold, triggerOnce, hasTriggered]);

  return { ref, isInView, hasTriggered };
};
