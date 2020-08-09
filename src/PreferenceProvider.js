import React, { createContext, useState, useEffect, useContext } from "react";
import Media from "react-media";

const preference = createContext(null);

const PreferenceProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // dynamically check theme
  useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    if (matcher.matches) setTheme("dark");

    const handler = (matcher) => {
      if (!matcher.matches) setTheme("light");
      else setTheme("dark");
    };
    matcher.addEventListener("change", handler);

    return () => {
      matcher.removeEventListener("change", handler);
    };
  }, []);

  return (
    <preference.Provider value={{ theme }}>{children}</preference.Provider>
  );
};

const usePrefs = () => {
  const value = useContext(preference);
  return value;
};

export { usePrefs };
export default PreferenceProvider;
