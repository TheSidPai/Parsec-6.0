import { useEffect, useState } from 'react';

/**
 * Hook to track overall page scroll progress
 * @returns {Object} { scrollProgress, scrollY, scrollDirection }
 */
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate progress (0-100)
      const progress = documentHeight > 0 ? (currentScrollY / documentHeight) * 100 : 0;
      
      // Determine scroll direction
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      
      setScrollProgress(progress);
      setScrollY(currentScrollY);
      setScrollDirection(direction);
      setLastScrollY(currentScrollY);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [lastScrollY]);

  return { scrollProgress, scrollY, scrollDirection };
};
