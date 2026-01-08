// themes.js
// Dynamic color themes for each Hogwarts House + main Hogwarts landing theme

const themes = [
  // 🧙‍♂️ Hogwarts (Main / Landing)
  {
    house: "Hogwarts",
    primary: "#0A1020",       // deep midnight blue (hero background tone)
    primaryRgb: "10, 16, 32",
    secondary: "#0A0A0A",     // near-black for depth
    secondaryRgb: "10, 10, 10",
    background: "#060814",    // page background (very dark blue/near-black)
    surface: "#0E1630",       // cards, modals (slightly lighter)
    border: "#232B3A",        // subtle divider

    fontMain: "#F5F1E6",      // warm off-white for body text
    fontSub: "#CFC7B9",       // secondary text
    fontAccent: "#D4AF37",    // classic gold accent
    fontAccentRgb: "212, 175, 55",
    fontAccentDark: "#8B6914", // darker gold for light backgrounds
    link: "#D4AF37",
    linkHover: "#FFF7D6",

    buttonBg: "#0b0027ff",      // darker gold for light backgrounds
    buttonHoverBg: "#A0771A",
    buttonText: "#F5F1E6",
    buttonBgLight: "#daa702ff", // original bright gold for dark backgrounds
    buttonHoverBgLight: "#121A36",
    buttonTextLight: "#F5F1E6",
    cardHover: "#162042",

    glow: "rgba(212, 175, 55, 0.18)",   // soft gold glow
    shadow: "rgba(0, 0, 0, 0.55)",
    gradient: "linear-gradient(90deg, #0A1020 0%, #081225 50%, #0A0A0A 100%)",

    success: "#28A745",
    error: "#DC3545",
    warning: "#FFC107",
    info: "#17A2B8"
  },

  // 🦁 Gryffindor
  {
    house: "Gryffindor",
    primary: "#7F0909",
    primaryRgb: "127, 9, 9",
    secondary: "#FFC500",
    secondaryRgb: "255, 197, 0",
    background: "#121212",
    surface: "#1E1E1E",
    border: "#3A3A3A",

    fontMain: "#FFFFFF",
    fontSub: "#B3B3B3",
    fontAccent: "#FFD700",
    fontAccentRgb: "255, 215, 0",
    fontAccentDark: "#8B0000", // dark red for light backgrounds
    link: "#FFC500",
    linkHover: "#FFFFFF",

    buttonBg: "#8B0000",      // darker red for light backgrounds
    buttonHoverBg: "#A01010",
    buttonText: "#FFFFFF",
    buttonBgLight: "#7F0909", // original red for dark backgrounds
    buttonHoverBgLight: "#9B1C1C",
    buttonTextLight: "#FFFFFF",
    cardHover: "#2C2C2C",

    glow: "rgba(255, 215, 0, 0.4)",
    shadow: "rgba(0, 0, 0, 0.4)",
    gradient: "linear-gradient(90deg, #7F0909, #FFC500)",

    success: "#28A745",
    error: "#DC3545",
    warning: "#FFC107",
    info: "#17A2B8"
  },

  // 🐍 Slytherin
  {
    house: "Slytherin",
    primary: "#1A472A",
    primaryRgb: "26, 71, 42",
    secondary: "#AAAAAA",
    secondaryRgb: "170, 170, 170",
    background: "#0E0E0E",
    surface: "#1B1B1B",
    border: "#2E2E2E",

    fontMain: "#E0E0E0",
    fontSub: "#A0A0A0",
    fontAccent: "#00FF99",
    fontAccentRgb: "0, 255, 153",
    fontAccentDark: "#0D5C2E", // dark green for light backgrounds
    link: "#AAAAAA",
    linkHover: "#FFFFFF",

    buttonBg: "#0D5C2E",      // darker green for light backgrounds
    buttonHoverBg: "#1A7A3E",
    buttonText: "#FFFFFF",
    buttonBgLight: "#1A472A", // original green for dark backgrounds
    buttonHoverBgLight: "#2E6042",
    buttonTextLight: "#FFFFFF",
    cardHover: "#242424",

    glow: "rgba(0, 255, 153, 0.3)",
    shadow: "rgba(0, 0, 0, 0.5)",
    gradient: "linear-gradient(90deg, #1A472A, #AAAAAA)",

    success: "#28A745",
    error: "#DC3545",
    warning: "#FFC107",
    info: "#17A2B8"
  },

  // 🦅 Ravenclaw
  {
    house: "Ravenclaw",
    primary: "#0E1A40",
    primaryRgb: "14, 26, 64",
    secondary: "#946B2D",
    secondaryRgb: "148, 107, 45",
    background: "#0A0A1A",
    surface: "#16162A",
    border: "#2A2A3A",

    fontMain: "#E6E6E6",
    fontSub: "#B0B0B0",
    fontAccent: "#A67C52",
    fontAccentRgb: "166, 124, 82",
    fontAccentDark: "#5C4A2E", // darker bronze for light backgrounds
    link: "#946B2D",
    linkHover: "#FFFFFF",

    buttonBg: "#5C4A2E",      // darker bronze for light backgrounds
    buttonHoverBg: "#6E5838",
    buttonText: "#FFFFFF",
    buttonBgLight: "#0E1A40", // original blue for dark backgrounds
    buttonHoverBgLight: "#182C60",
    buttonTextLight: "#FFFFFF",
    cardHover: "#1E1E33",

    glow: "rgba(148, 107, 45, 0.4)",
    shadow: "rgba(0, 0, 0, 0.4)",
    gradient: "linear-gradient(90deg, #0E1A40, #946B2D)",

    success: "#28A745",
    error: "#DC3545",
    warning: "#FFC107",
    info: "#17A2B8"
  },

  // 🦡 Hufflepuff
  {
    house: "Hufflepuff",
    primary: "#EEE117",
    primaryRgb: "238, 225, 23",
    secondary: "#ffc400ff",
    secondaryRgb: "255, 196, 0",
    background: "#141414",
    surface: "#1C1C1C",
    border: "#2D2D2D",

    fontMain: "#FFFFFF",
    fontSub: "#BEBEBE",
    fontAccent: "#FFF799",
    fontAccentRgb: "255, 247, 153",
    fontAccentDark: "#8B7E00", // darker yellow for light backgrounds
    link: "#EEE117",
    linkHover: "#FFFFFF",

    buttonBg: "#8B7E00",      // darker yellow for light backgrounds
    buttonHoverBg: "#A09000",
    buttonText: "#FFFFFF",
    buttonBgLight: "#EEE117", // original bright yellow for dark backgrounds
    buttonHoverBgLight: "#FFD700",
    buttonTextLight: "#000000",
    cardHover: "#2A2A2A",

    glow: "rgba(238, 225, 23, 0.4)",
    shadow: "rgba(0, 0, 0, 0.5)",
    gradient: "linear-gradient(90deg, #EEE117, #000000)",

    success: "#28A745",
    error: "#DC3545",
    warning: "#FFC107",
    info: "#17A2B8"
  }
];

// Utility function to apply a selected house theme as CSS variables
// If houseName is falsy or not found, defaults to the "Hogwarts" main theme.
export const applyTheme = (houseName) => {
  const target = (houseName && houseName.toLowerCase()) || "hogwarts";
  const theme = themes.find(t => t.house.toLowerCase() === target);
  if (!theme) return;

  Object.entries(theme).forEach(([key, value]) => {
    if (key !== "house") {
      document.documentElement.style.setProperty(`--${key}`, value);
    }
  });
};

export default themes;
