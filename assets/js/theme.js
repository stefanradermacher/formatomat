export const THEMES = {
    brass:    { id: "brass",    label: "Formatomat Brass",    prefers: "light" },
    copper:   { id: "copper",   label: "Formatomat Copper",   prefers: "dark"  },
    pewter:   { id: "pewter",   label: "Formatomat Pewter",   prefers: "light" },
    steel:    { id: "steel",    label: "Formatomat Steel",    prefers: "light" },
    iron:     { id: "iron",     label: "Formatomat Iron",     prefers: "dark"  },
    titanium: { id: "titanium", label: "Formatomat Titanium", prefers: "dark"  },
    chrome:   { id: "chrome",   label: "Formatomat Chrome",   prefers: "light" },
};

export const ALLOWED_THEMES = new Set(Object.keys(THEMES));
export const DEFAULT_LIGHT_THEME = "brass";
export const DEFAULT_DARK_THEME  = "copper";

export function applyTheme(themeKey, DOM) {
    if (!ALLOWED_THEMES.has(themeKey)) themeKey = DEFAULT_DARK_THEME;
    const theme = THEMES[themeKey];
    if (!theme) return;
    document.documentElement.setAttribute("data-theme", themeKey);
    if (DOM.themeSelect) DOM.themeSelect.value = themeKey;
    if (DOM.metaThemeColor) {
        const color = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
        if (color) DOM.metaThemeColor.setAttribute("content", color);
    }
}

export function getInitialTheme(storageKey) {
    try {
        const stored = localStorage.getItem(storageKey);
        if (stored && ALLOWED_THEMES.has(stored)) return stored;
    } catch (_) {}
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? DEFAULT_DARK_THEME
        : DEFAULT_LIGHT_THEME;
}
