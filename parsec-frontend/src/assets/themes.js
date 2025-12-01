// themes.js
// Dynamic color themes for each Hogwarts House + main Hogwarts landing theme

const themes = [
  // 🧙‍♂️ Hogwarts (Main / Landing)
  {
    house: "Hogwarts",
    primary: "#0A1020",       // deep midnight blue (hero background tone)
    secondary: "#0A0A0A",     // near-black for depth
    background: "#060814",    // page background (very dark blue/near-black)
    surface: "#0E1630",       // cards, modals (slightly lighter)
    border: "#232B3A",        // subtle divider

    fontMain: "#F5F1E6",      // warm off-white for body text
    fontSub: "#CFC7B9",       // secondary text
    fontAccent: "#D4AF37",    // classic gold accent
    link: "#D4AF37",
    linkHover: "#FFF7D6",

    buttonBg: "#daa702ff",
    buttonHoverBg: "#121A36",
    buttonText: "#F5F1E6",
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
    secondary: "#FFC500",
    background: "#121212",
    surface: "#1E1E1E",
    border: "#3A3A3A",

    fontMain: "#FFFFFF",
    fontSub: "#B3B3B3",
    fontAccent: "#FFD700",
    link: "#FFC500",
    linkHover: "#FFFFFF",

    buttonBg: "#7F0909",
    buttonHoverBg: "#9B1C1C",
    buttonText: "#FFFFFF",
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
    secondary: "#AAAAAA",
    background: "#0E0E0E",
    surface: "#1B1B1B",
    border: "#2E2E2E",

    fontMain: "#E0E0E0",
    fontSub: "#A0A0A0",
    fontAccent: "#00FF99",
    link: "#AAAAAA",
    linkHover: "#FFFFFF",

    buttonBg: "#1A472A",
    buttonHoverBg: "#2E6042",
    buttonText: "#FFFFFF",
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
    secondary: "#946B2D",
    background: "#0A0A1A",
    surface: "#16162A",
    border: "#2A2A3A",

    fontMain: "#E6E6E6",
    fontSub: "#B0B0B0",
    fontAccent: "#A67C52",
    link: "#946B2D",
    linkHover: "#FFFFFF",

    buttonBg: "#0E1A40",
    buttonHoverBg: "#182C60",
    buttonText: "#FFFFFF",
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
    secondary: "#000000",
    background: "#141414",
    surface: "#1C1C1C",
    border: "#2D2D2D",

    fontMain: "#FFFFFF",
    fontSub: "#BEBEBE",
    fontAccent: "#FFF799",
    link: "#EEE117",
    linkHover: "#FFFFFF",

    buttonBg: "#EEE117",
    buttonHoverBg: "#FFD700",
    buttonText: "#000000",
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
