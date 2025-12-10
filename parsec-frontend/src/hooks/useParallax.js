import { useEffect, useRef, useState } from 'react';

/**
 * Hook to create parallax scroll effects on elements
 * @param {number} speed - Parallax speed multiplier (0.5 = half speed, 2 = double speed)
 * @param {string} direction - 'vertical' or 'horizontal'
 * @returns {Object} { ref, offset }
 */
export const useParallax = (speed = 0.5, direction = 'vertical') => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const elementTop = rect.top + scrolled;
      const windowHeight = window.innerHeight;
      
      // Calculate parallax offset based on scroll position
      const scrollProgress = (scrolled + windowHeight - elementTop) / (windowHeight + rect.height);
      
      if (direction === 'vertical') {
        const parallaxOffset = (scrolled - elementTop) * (1 - speed);
        setOffset(parallaxOffset);
      } else {
        const parallaxOffset = (scrolled - elementTop) * (1 - speed);
        setOffset(parallaxOffset);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [speed, direction]);

  return { ref, offset };
};
