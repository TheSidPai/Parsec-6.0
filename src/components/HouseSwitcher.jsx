import React, { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import themes from '../assets/themes';
import './HouseSwitcher.css';

function HouseSwitcher() {
  const { themeName, setHouseTheme } = useTheme();
  const options = useMemo(
    () => themes.map(t => t.house).filter(h => h !== 'Hogwarts'),
    []
  );

  const handleChange = (e) => {
    const house = e.target.value;
    setHouseTheme(house);
  };

  return (
    <div className="house-switcher">
      <label htmlFor="house-select" className="house-switcher-label">House Theme</label>
      <select id="house-select" className="house-switcher-select" onChange={handleChange} value={options.includes(themeName) ? themeName : ''}>
        <option value="" disabled>Select house…</option>
        {options.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <p className="house-switcher-hint">Applies to dashboard pages only.</p>
    </div>
  );
}

export default HouseSwitcher;
