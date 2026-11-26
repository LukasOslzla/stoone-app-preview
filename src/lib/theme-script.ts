/** Where the chosen theme ("auto" | "light" | "dark") is remembered. */
export const THEME_STORAGE_KEY = "stoone-theme";

/**
 * Inline script for <head>: sets `data-theme` on <html> before the first
 * paint, so the page never flashes in the wrong theme. Kept apart from
 * `lib/theme` (a client module) so the server layout can import it.
 */
export const themeInitScript = `(function(){try{var c=localStorage.getItem("${THEME_STORAGE_KEY}")||"dark";var t=c==="auto"?(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):c;document.documentElement.dataset.theme=t}catch(e){}})()`;
