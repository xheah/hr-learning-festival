"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setIsDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="h-9 w-9 rounded-full border border-[var(--line)] bg-[var(--bg-elev)] grid place-items-center text-lg active:scale-95 transition"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
