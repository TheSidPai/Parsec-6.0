import { useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

export const useLocomotiveScroll = (start = true) => {
  useEffect(() => {
    if (!start) return;

    const scrollEl = document.querySelector('[data-scroll-container]');
    
    if (!scrollEl) {
      console.warn('Locomotive Scroll: No element with [data-scroll-container] found');
      return;
    }

    const locoScroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      multiplier: 1.0,
      class: 'is-inview',
      smartphone: {
        smooth: true,
        multiplier: 1.5,
      },
      tablet: {
        smooth: true,
        multiplier: 1.2,
      },
      reloadOnContextChange: true,
      lerp: 0.1, // Linear interpolation intensity (0-1, lower = smoother)
    });

    // Update on window resize
    const handleResize = () => {
      locoScroll.update();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      locoScroll.destroy();
    };
  }, [start]);
};
