import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem("shopSphereLanguage") || "English";
    } catch {
      return "English";
    }
  });

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage);
    try {
      localStorage.setItem("shopSphereLanguage", nextLanguage);
    } catch {
      // Language still works for the current session if storage is unavailable.
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}