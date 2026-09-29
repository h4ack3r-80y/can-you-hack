"use client";
import { useState } from "react";
import { IconSun, IconMoon } from "./icons";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>(() =>
    typeof document !== "undefined" ? document.documentElement.dataset.theme || "dark" : "dark"
  );
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("cyh-theme", next); } catch {}
    setTheme(next);
  };
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className="p-2 rounded-lg border border-edge bg-panel text-zinc-500 hover:text-neon hover:border-neon transition-colors"
    >
      {theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
    </button>
  );
}
