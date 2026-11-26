"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./theme-script";

/** What the user picked; `auto` follows the system setting. */
export type ThemeChoice = "auto" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export { THEME_STORAGE_KEY };

const listeners = new Set<() => void>();

function readChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "auto" || stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // Storage may be blocked; fall back to the default.
  }
  return "dark";
}

function resolve(choice: ThemeChoice): ResolvedTheme {
  if (choice !== "auto") return choice;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/** Saves the choice and switches the theme of the whole app. */
export function setTheme(choice: ThemeChoice) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Not saved, but still applied for this visit.
  }
  document.documentElement.dataset.theme = resolve(choice);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const media = matchMedia("(prefers-color-scheme: light)");
  const onSystemChange = () => {
    if (readChoice() === "auto") setTheme("auto");
  };
  media.addEventListener("change", onSystemChange);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onSystemChange);
  };
}

/**
 * Current theme: `choice` is what the user picked, `theme` what is shown.
 * On the server (and during hydration) it reports the default dark theme.
 */
export function useTheme(): { choice: ThemeChoice; theme: ResolvedTheme } {
  const choice = useSyncExternalStore<ThemeChoice>(
    subscribe,
    readChoice,
    () => "dark",
  );
  const theme = useSyncExternalStore<ResolvedTheme>(
    subscribe,
    () => resolve(readChoice()),
    () => "dark",
  );
  return { choice, theme };
}
