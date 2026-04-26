"use client";

import { useEffect, useState } from "react";

type ThemePreference = "auto" | "day" | "night";
type ResolvedTheme = "day" | "night";

const storageKey = "math-quiz-portal-theme";

function getTimeTheme(date = new Date()): ResolvedTheme {
  const hour = date.getHours();

  return hour >= 6 && hour < 18 ? "day" : "night";
}

function applyTheme(preference: ThemePreference) {
  const resolvedTheme = preference === "auto" ? getTimeTheme() : preference;
  const root = document.documentElement;

  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme === "night" ? "dark" : "light";

  return resolvedTheme;
}

function getStoredPreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "auto";
  }

  const savedPreference = window.localStorage.getItem(storageKey);

  return savedPreference === "day" || savedPreference === "night" || savedPreference === "auto"
    ? savedPreference
    : "auto";
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>(getStoredPreference);
  const [autoTheme, setAutoTheme] = useState<ResolvedTheme>(() => getTimeTheme());
  const resolvedTheme = preference === "auto" ? autoTheme : preference;

  useEffect(() => {
    applyTheme(preference);

    if (preference === "auto") {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, preference);
    }
  }, [preference]);

  useEffect(() => {
    if (preference !== "auto") {
      return;
    }

    const intervalId = window.setInterval(() => {
      applyTheme("auto");
      setAutoTheme(getTimeTheme());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, [preference]);

  const toggleTheme = () => {
    setPreference((currentPreference) => {
      const activeTheme = currentPreference === "auto" ? resolvedTheme : currentPreference;
      return activeTheme === "day" ? "night" : "day";
    });
  };

  return (
    <div className="theme-toggle-wrap">
      <div className="theme-toggle-panel">
        <button className="focus-outline theme-toggle-button" onClick={toggleTheme} type="button">
          {resolvedTheme === "day" ? "Night mode" : "Day mode"}
        </button>
        <button
          className={`focus-outline theme-toggle-auto ${preference === "auto" ? "theme-toggle-auto-active" : ""}`}
          onClick={() => setPreference("auto")}
          type="button"
        >
          Auto
        </button>
      </div>
    </div>
  );
}
