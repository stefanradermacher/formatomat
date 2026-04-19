// i18n — lazy-loaded locale modules.

import { state } from "./state.js";

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
    if (LOCALES[code]) return;
    try {
        const mod = await import(`./locales/${code}.js`);
        LOCALES[code] = mod.default;
    } catch (_) {
        if (code !== FALLBACK_LANG) await loadLocale(FALLBACK_LANG);
    }
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

export function applyLocale(DOM, config, helpers = {}) {
    if (!state.currentLocale) return;
    const ui = state.currentLocale.ui || {};

    document.documentElement.setAttribute(
        "lang",
        state.currentLocale.htmlLang || state.currentLocale.code || "en"
    );

    document.querySelector(".tagline").textContent = ui.tagline;

    // formatter-specific labels
    DOM.inputFormatLabel.textContent  = ui.inputFormatLabel;
    DOM.outputFormatLabel.textContent = ui.outputFormatLabel;
    DOM.inputLabel.textContent        = ui.inputLabel;
    DOM.outputLabel.textContent       = ui.outputLabel;
    DOM.actionLabel.textContent       = ui.actionLabel;
    DOM.indentLabel.textContent       = ui.indentLabel;
    DOM.optionsLabel.textContent  = ui.optionsLabel;
    DOM.prettyBtn.textContent     = ui.actionPretty;
    DOM.minifyBtn.textContent     = ui.actionMinify;
    DOM.sortKeysLabel.textContent = ui.sortKeys;
    if (DOM.aboutLink && ui.aboutLink) DOM.aboutLink.textContent = ui.aboutLink;

    if (DOM.footerSupport && ui.footerSupportText) {
        const parts = ui.footerSupportText.split("{link}");
        DOM.footerSupport.textContent = "";
        DOM.footerSupport.appendChild(document.createTextNode(parts[0] || ""));
        const a = document.createElement("a");
        a.href = "#";
        a.id = "supportLink";
        a.textContent = ui.footerSupportLink || "";
        DOM.footerSupport.appendChild(a);
        DOM.footerSupport.appendChild(document.createTextNode(parts[1] || ""));
    }

    if (DOM.supportModalTitle && ui.supportTitle) DOM.supportModalTitle.textContent = ui.supportTitle;
    if (DOM.supportModalBody) {
        DOM.supportModalBody.textContent = "";
        [ui.supportIntro, ui.supportP1].filter(Boolean).forEach((text) => {
            const p = document.createElement("p");
            p.textContent = text;
            DOM.supportModalBody.appendChild(p);
        });
        const row = document.createElement("div");
        row.className = "support-button-row";
        const donateLink = document.createElement("a");
        donateLink.className = "support-button support-button-primary";
        donateLink.href = config.DONATE_PAYPAL_URL;
        donateLink.target = "_blank";
        donateLink.rel = "noopener noreferrer";
        donateLink.textContent = ui.supportPaypalLabel || "Donate via PayPal";
        row.appendChild(donateLink);
        DOM.supportModalBody.appendChild(row);
    }

    [
        [DOM.pasteBtn,       ui.tooltipPaste],
        [DOM.clearInputBtn,  ui.tooltipClearInput],
        [DOM.copyOutputBtn,  ui.tooltipCopy],
        [DOM.downloadBtn,    ui.tooltipDownload],
        [DOM.expandInputBtn, DOM.pageWrapper?.classList.contains("is-expanded") ? ui.tooltipCollapse : ui.tooltipExpand],
    ].forEach(([el, label]) => {
        if (!el || !label) return;
        el.setAttribute("data-tooltip", label);
        el.setAttribute("aria-label", label);
    });

    if (DOM.impressumLink && ui.impressumLink) DOM.impressumLink.textContent = ui.impressumLink;
    if (DOM.privacyLink   && ui.privacyLink)   DOM.privacyLink.textContent   = ui.privacyLink;

    if (DOM.aboutModalTitle && ui.aboutTitle) DOM.aboutModalTitle.textContent = ui.aboutTitle;
    if (DOM.aboutModalBody) {
        DOM.aboutModalBody.textContent = "";
        [ui.aboutP1, ui.aboutP2, ui.aboutP3].filter(Boolean).forEach((text) => {
            const p = document.createElement("p");
            p.textContent = text;
            DOM.aboutModalBody.appendChild(p);
        });
        const deps = document.createElement("div");
        deps.className = "modal-deps";
        const depsLabel = document.createElement("p");
        depsLabel.textContent = ui.aboutDepsLabel || "Open source components used:";
        deps.appendChild(depsLabel);
        [
            { name: "jsonc-parser",    author: "Microsoft",        license: "MIT",                    url: "https://github.com/microsoft/node-jsonc-parser" },
            { name: "fast-xml-parser", author: "Naturalintelli",   license: "MIT",                    url: "https://github.com/NaturalIntelligence/fast-xml-parser" },
            { name: "smol-toml",       author: "Cleo Rebert",      license: "MIT",                    url: "https://github.com/nicolo-ribaudo/smol-toml" },
            { name: "CodeMirror",      author: "Marijn Haverbeke", license: "MIT",                    url: "https://codemirror.net" },
            { name: "IBM Plex Mono",   author: "IBM",              license: "SIL Open Font License 1.1", url: "https://github.com/IBM/plex" },
        ].forEach(({ name, author, license, url }) => {
            const p = document.createElement("p");
            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            a.rel = "noopener";
            a.textContent = name;
            p.appendChild(a);
            p.appendChild(document.createTextNode(` — ${author} — ${license}`));
            deps.appendChild(p);
        });
        DOM.aboutModalBody.appendChild(deps);
    }

    if (DOM.privacyModalTitle && ui.privacyTitle) DOM.privacyModalTitle.textContent = ui.privacyTitle;
    if (DOM.privacyModalBody) {
        DOM.privacyModalBody.textContent = "";
        [ui.privacyP1, ui.privacyP2, ui.privacyP3, ui.privacyP4].filter(Boolean).forEach((text) => {
            const p = document.createElement("p");
            p.textContent = text;
            DOM.privacyModalBody.appendChild(p);
        });
    }

    if (DOM.impressumModalTitle && ui.impressumTitle) DOM.impressumModalTitle.textContent = ui.impressumTitle;
    if (DOM.impressumModalBody) {
        DOM.impressumModalBody.textContent = "";
        const p1 = document.createElement("p");
        const providerLabel = document.createElement("strong");
        providerLabel.textContent = ui.impressumProviderLabel || "Service provider";
        p1.appendChild(providerLabel);
        config.OWNER_ADDRESS.forEach((line) => {
            p1.appendChild(document.createElement("br"));
            p1.appendChild(document.createTextNode(line));
        });
        DOM.impressumModalBody.appendChild(p1);

        const p2 = document.createElement("p");
        const contactLabel = document.createElement("strong");
        contactLabel.textContent = ui.impressumContactLabel || "Contact";
        p2.appendChild(contactLabel);
        p2.appendChild(document.createElement("br"));
        p2.appendChild(document.createTextNode(ui.impressumEmailLabel || "E-mail: "));
        const emailLink = document.createElement("a");
        emailLink.href = "mailto:" + config.EMAIL;
        emailLink.textContent = config.EMAIL;
        p2.appendChild(emailLink);
        DOM.impressumModalBody.appendChild(p2);

        [ui.impressumP3, ui.impressumP4].filter(Boolean).forEach((text) => {
            const p = document.createElement("p");
            p.textContent = text;
            DOM.impressumModalBody.appendChild(p);
        });
    }

    helpers.afterLocaleApplied?.(ui);
}

// Switches locale state + applies to DOM; does NOT call updateUI — caller's responsibility.
export async function switchLocale(lang, DOM, config, storageKey, helpers = {}) {
    if (!SUPPORTED_CODES.has(lang)) lang = FALLBACK_LANG;
    await loadLocale(lang);
    state.currentLocale = LOCALES[lang] || LOCALES[FALLBACK_LANG] || {};
    const code = state.currentLocale.code || lang;
    if (DOM.langSelect) DOM.langSelect.value = code;
    applyLocale(DOM, config, helpers);
    try { localStorage.setItem(storageKey, code); } catch (_) {}
}

// Substitute {placeholders} in a locale string.
export function t(template, vars = {}) {
    if (!template) return "";
    return template.replace(/\{(\w+)}/g, (_, key) => vars[key] ?? `{${key}}`);
}
