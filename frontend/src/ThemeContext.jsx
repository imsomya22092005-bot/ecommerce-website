import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("shopSphereTheme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("shopSphereTheme", theme);
    } catch {
      // The selected theme still applies for this session.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => current === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
