"use client";

import { useEffect, useState } from "react";

const storageKey = "mydevlab-theme";
type ResolvedTheme = "light" | "dark";

function resolveSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ResolvedTheme>("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey);
    const initialTheme: ResolvedTheme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : resolveSystemTheme();

    setTheme(initialTheme);
    setHydrated(true);

    if (storedTheme === "light" || storedTheme === "dark") {
      applyTheme(initialTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (!window.localStorage.getItem(storageKey)) {
        const nextTheme = resolveSystemTheme();
        setTheme(nextTheme);
        applyTheme(nextTheme);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  function toggleTheme() {
    const nextTheme: ResolvedTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  }

  const nextThemeLabel = theme === "dark" ? "claro" : "escuro";

  return (
    <button
      aria-label={`Ativar tema ${nextThemeLabel}`}
      aria-pressed={hydrated && theme === "dark"}
      className="theme-toggle"
      data-mode={theme}
      onClick={toggleTheme}
      type="button"
    >
      <svg aria-hidden="true" className="theme-toggle__sun" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <span className="theme-toggle__divider" />
      <svg aria-hidden="true" className="theme-toggle__moon" viewBox="0 0 24 24">
        <path d="M20.4 15.1A8.5 8.5 0 0 1 8.9 3.6 8.5 8.5 0 1 0 20.4 15.1Z" />
      </svg>
    </button>
  );
}
