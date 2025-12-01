import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import themes, { applyTheme } from '../assets/themes';

const ThemeContext = createContext({
  themeName: 'Hogwarts',
  theme: {},
  setHouseTheme: (_house) => {},
});

export const ThemeProvider = ({ children }) => {
  const location = useLocation();
  const [themeName, setThemeName] = useState('Hogwarts');

  const setHouseTheme = (house) => {
    if (!house) return;
    localStorage.setItem('house', house);
    // Only apply immediately if on dashboard; public pages remain Hogwarts
    if (location.pathname.startsWith('/dashboard')) {
      setThemeName(house);
      applyTheme(house);
    }
  };

  // Update theme based on route changes
  useEffect(() => {
    const isDashboard = location.pathname.startsWith('/dashboard');
    if (isDashboard) {
      const params = new URLSearchParams(location.search);
      const fromQuery = params.get('house');
      if (fromQuery) {
        localStorage.setItem('house', fromQuery);
      }
      const stored = localStorage.getItem('house');
      const target = stored || 'Hogwarts';
      setThemeName(target);
      applyTheme(target);
    } else {
      setThemeName('Hogwarts');
      applyTheme('Hogwarts');
    }
  }, [location.pathname, location.search]);

  const theme = useMemo(() => {
    const found = themes.find(t => t.house.toLowerCase() === themeName.toLowerCase());
    return found || themes[0];
  }, [themeName]);

  const value = useMemo(() => ({ themeName, theme, setHouseTheme }), [themeName, theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
