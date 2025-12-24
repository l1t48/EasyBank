import { useState, useEffect, createContext } from "react";
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const setScrollbarTheme = (theme) => {
    const thumb = theme === "dark" ? "#44bc7088" : "#2c577ab1";
    const track = theme === "dark" ? "#17171b" : "hsl(172, 50%, 90%)";

    document.documentElement.style.scrollbarWidth = "thin";
    document.documentElement.style.scrollbarColor = `${thumb} ${track}`;
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    setScrollbarTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    setScrollbarTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
