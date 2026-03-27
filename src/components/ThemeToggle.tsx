"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: "light" | "dark" = saved || (systemPrefersDark ? "dark" : "light");
    
    console.log('ThemeToggle init:', { saved, systemPrefersDark, initialTheme });
    
    setTheme(initialTheme);
    applyTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement;
    
    if (newTheme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
    
    // Force a reflow to ensure theme changes are applied immediately
    root.style.display = 'none';
    root.offsetHeight; // Trigger reflow
    root.style.display = '';
  };

  const toggleTheme = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    const newTheme = theme === "dark" ? "light" : "dark";
    
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    
    console.log('Switched to', newTheme, 'mode');
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="
        rounded-full w-9 h-9 p-0
        border border-border
        bg-background hover:bg-muted
        transition-all duration-200
        hover:scale-105
        active:scale-95
        shadow-sm
        flex items-center justify-center
        hover:border-primary/50
        hover:shadow-[0_0_8px_var(--hover-glow)]
      "
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
