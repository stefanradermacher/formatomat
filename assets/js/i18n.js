// i18n — lazy-loaded locale modules.

export const SUPPORTED_LOCALES = [
    { code: "en", name: "English" },
    { code: "de", name: "Deutsch" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "nl", name: "Nederlands" },
    { code: "pl", name: "Polski" },
    { code: "pt", name: "Português" },
    { code: "ru", name: "Русский" },
    { code: "tr", name: "Türkçe" },
    { code: "uk", name: "Українська" },
    { code: "ja", name: "日本語" },
    { code: "zh", name: "中文" },
];

export const SUPPORTED_CODES = new Set(SUPPORTED_LOCALES.map((l) => l.code));
export const FALLBACK_LANG = "en";

const LOCALES = {};

export async function loadLocale(code) {
    if (!SUPPORTED_CODES.has(code)) code = FALLBACK_LANG;
    if (LOCALES[code]) return LOCALES[code];
    try {
        const mod = await import(`./locales/${code}.js`);
        LOCALES[code] = mod.default;
    } catch (_) {
        if (code !== FALLBACK_LANG) return loadLocale(FALLBACK_LANG);
    }
    return LOCALES[code];
}

export function getInitialLanguage(storageKey) {
    try {
        const stored = localStorage.getItem(storageKey);
        if (stored && SUPPORTED_CODES.has(stored)) return stored;
    } catch (_) {}
    const browserLang = (navigator.language || "").slice(0, 2).toLowerCase();
    if (SUPPORTED_CODES.has(browserLang)) return browserLang;
    return FALLBACK_LANG;
}

// Substitute {placeholders} in a locale string
export function t(template, vars = {}) {
    if (!template) return "";
    return template.replace(/\{(\w+)}/g, (_, key) => vars[key] ?? `{${key}}`);
}
