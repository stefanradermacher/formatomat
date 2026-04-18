// ============================================================================
//  Formatomat — Entry point
// ============================================================================

import { state } from "./state.js";
import { FORMATS, FORMAT_LIST, getFormat, detectFormat } from "./formats.js";
import { THEMES, applyTheme, getInitialTheme } from "./theme.js";
import { openModal, closeModal } from "./modals.js";
import {
    SUPPORTED_LOCALES,
    loadLocale, getInitialLanguage, FALLBACK_LANG, t,
} from "./i18n.js";
import {
    createInputEditor, createOutputEditor,
    getText, setText,
    setLanguage as setEditorLanguage,
    focusAndMoveTo,
} from "./editor.js";

let inputEditor, outputEditor;

const LANG_STORAGE_KEY  = "formatomat_language";
const THEME_STORAGE_KEY = "formatomat_theme";
const DEBUG = new URLSearchParams(location.search).has("debug");

const DONATE_PAYPAL_URL = "https://paypal.me/formatomat";

const OWNER_ADDRESS = [
    "Stefan Radermacher",
    "Siegburger Straße 171",
    "50679 Köln",
    "Deutschland",
];
const EMAIL = ["info", "formatomat.net"].join("@");

let DOM;
let currentLocale = null;

// ─── Utilities ────────────────────────────────────────────────────────────────

function dbg(...args) { if (DEBUG) console.warn(...args); }

function debounce(fn, delay = 200) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function formatBytes(n) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function countLines(s) {
    if (!s) return 0;
    return s.split("\n").length;
}

function flash(el, className = "success-flash", duration = 900) {
    el.classList.add(className);
    setTimeout(() => el.classList.remove(className), duration);
}

// ─── Rendering: format tabs ───────────────────────────────────────────────────

function renderFormatTabs() {
    renderTabGroup(DOM.inputFormatTabs, "inputFormat");
    renderTabGroup(DOM.outputFormatTabs, "outputFormat");
}

function renderTabGroup(container, stateKey) {
    container.textContent = "";
    FORMAT_LIST.forEach(({ id, name }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "format-tab";
        btn.dataset.format = id;
        btn.textContent = name;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", String(id === state[stateKey]));
        if (id === state[stateKey]) btn.classList.add("active");
        btn.addEventListener("click", () => {
            if (stateKey === "inputFormat") {
                const oldSample = currentLocale?.ui[`sample_${state.inputFormat}`] ?? "";
                const current   = getText(inputEditor).trim();
                state.inputFormat = id;
                state.autoDetected = false;
                updateStatusText();
                if (inputEditor) setEditorLanguage(inputEditor, id);
                if (!current || current === oldSample.trim()) {
                    const newSample = currentLocale?.ui[`sample_${id}`] ?? "";
                    setText(inputEditor, newSample);
                    state.autoDetected = true;
                }
            }
            if (stateKey === "outputFormat") {
                state.outputFormat = id;
                renderActionButtons();
                if (outputEditor) setEditorLanguage(outputEditor, id);
            }
            updateActiveTabs();
            runConversion();
        });
        container.appendChild(btn);
    });
}

function updateActiveTabs() {
    DOM.inputFormatTabs.querySelectorAll(".format-tab").forEach((btn) => {
        const active = btn.dataset.format === state.inputFormat;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", String(active));
    });
    DOM.outputFormatTabs.querySelectorAll(".format-tab").forEach((btn) => {
        const active = btn.dataset.format === state.outputFormat;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", String(active));
    });
}

function updateStatusText() {
    if (!currentLocale) return;
    const ui = currentLocale.ui;
    if (state.autoDetected && getText(inputEditor).trim()) {
        DOM.inputStatus.textContent = ui.autoDetected;
        DOM.inputStatus.classList.add("auto");
    } else {
        DOM.inputStatus.textContent = ui.manual;
        DOM.inputStatus.classList.remove("auto");
    }
}

// ─── Rendering: controls ──────────────────────────────────────────────────────

function renderActionButtons() {
    const fmt = FORMATS[state.outputFormat];
    const minifyAllowed = fmt?.canMinify !== false;
    if (!minifyAllowed && state.action === "minify") state.action = "pretty";

    DOM.minifyBtn.disabled = !minifyAllowed;
    DOM.minifyBtn.classList.toggle("active", state.action === "minify");
    DOM.prettyBtn.classList.toggle("active", state.action === "pretty");
    DOM.indentGroup.style.opacity = state.action === "pretty" ? "1" : "0.4";
    DOM.indentGroup.style.pointerEvents = state.action === "pretty" ? "auto" : "none";
}

function renderThemeSelect() {
    DOM.themeSelect.textContent = "";
    Object.values(THEMES).forEach((t) => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = t.label;
        DOM.themeSelect.appendChild(opt);
    });
}

function renderLanguageSelect() {
    DOM.langSelect.textContent = "";
    SUPPORTED_LOCALES.forEach(({ code, name }) => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = name;
        DOM.langSelect.appendChild(opt);
    });
}

// ─── Locale application ───────────────────────────────────────────────────────

function applyLocale() {
    if (!currentLocale) return;
    const ui = currentLocale.ui;
    document.documentElement.setAttribute("lang", currentLocale.htmlLang || currentLocale.code);

    document.querySelector(".tagline").textContent = ui.tagline;
    DOM.inputFormatLabel.textContent  = ui.inputFormatLabel;
    DOM.outputFormatLabel.textContent = ui.outputFormatLabel;
    DOM.inputLabel.textContent        = ui.inputLabel;
    DOM.outputLabel.textContent       = ui.outputLabel;
    DOM.actionLabel.textContent       = ui.actionLabel;
    DOM.indentLabel.textContent       = ui.indentLabel;
    if (DOM.indentSelect) {
        const current = DOM.indentSelect.value || state.indent;
        DOM.indentSelect.textContent = "";
        [["2", ui.indent2], ["4", ui.indent4], ["tab", ui.indentTab]].forEach(([val, label]) => {
            const opt = document.createElement("option");
            opt.value = val;
            opt.textContent = label;
            DOM.indentSelect.appendChild(opt);
        });
        DOM.indentSelect.value = current;
    }
    DOM.optionsLabel.textContent      = ui.optionsLabel;
    DOM.prettyBtn.textContent         = ui.actionPretty;
    DOM.minifyBtn.textContent         = ui.actionMinify;
    DOM.sortKeysLabel.textContent     = ui.sortKeys;
    if (DOM.aboutLink && ui.aboutLink) DOM.aboutLink.textContent = ui.aboutLink;

    // Footer support text with inline link
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

    // Support modal
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
        donateLink.href = DONATE_PAYPAL_URL;
        donateLink.target = "_blank";
        donateLink.rel = "noopener noreferrer";
        donateLink.textContent = ui.supportPaypalLabel || "Donate via PayPal";
        row.appendChild(donateLink);
        DOM.supportModalBody.appendChild(row);
    }

    // Icon button tooltips
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

    // Impressum link label
    if (DOM.impressumLink && ui.impressumLink) DOM.impressumLink.textContent = ui.impressumLink;
    if (DOM.privacyLink   && ui.privacyLink)   DOM.privacyLink.textContent   = ui.privacyLink;

    // About modal
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
            { name: "jsonc-parser", author: "Microsoft", license: "MIT", url: "https://github.com/microsoft/node-jsonc-parser" },
            { name: "fast-xml-parser", author: "Naturalintelli", license: "MIT", url: "https://github.com/NaturalIntelligence/fast-xml-parser" },
            { name: "smol-toml", author: "Cleo Rebert", license: "MIT", url: "https://github.com/nicolo-ribaudo/smol-toml" },
            { name: "CodeMirror", author: "Marijn Haverbeke", license: "MIT", url: "https://codemirror.net" },
            { name: "IBM Plex Mono", author: "IBM", license: "SIL Open Font License 1.1", url: "https://github.com/IBM/plex" },
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

    // Privacy modal
    if (DOM.privacyModalTitle && ui.privacyTitle) DOM.privacyModalTitle.textContent = ui.privacyTitle;
    if (DOM.privacyModalBody) {
        DOM.privacyModalBody.textContent = "";
        [ui.privacyP1, ui.privacyP2, ui.privacyP3, ui.privacyP4].filter(Boolean).forEach((text) => {
            const p = document.createElement("p");
            p.textContent = text;
            DOM.privacyModalBody.appendChild(p);
        });
    }

    // Impressum modal
    if (DOM.impressumModalTitle && ui.impressumTitle) DOM.impressumModalTitle.textContent = ui.impressumTitle;
    if (DOM.impressumModalBody) {
        DOM.impressumModalBody.textContent = "";

        const p1 = document.createElement("p");
        const providerLabel = document.createElement("strong");
        providerLabel.textContent = ui.impressumProviderLabel || "Service provider";
        p1.appendChild(providerLabel);
        OWNER_ADDRESS.forEach((line) => {
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
        emailLink.href = "mailto:" + EMAIL;
        emailLink.textContent = EMAIL;
        p2.appendChild(emailLink);
        DOM.impressumModalBody.appendChild(p2);

        [ui.impressumP3, ui.impressumP4].filter(Boolean).forEach((text) => {
            const p = document.createElement("p");
            p.textContent = text;
            DOM.impressumModalBody.appendChild(p);
        });
    }

    updateStatusText();
}

async function setLanguage(code) {
    currentLocale = await loadLocale(code);
    if (!currentLocale) currentLocale = await loadLocale(FALLBACK_LANG);
    DOM.langSelect.value = currentLocale.code;
    applyLocale();
    try { localStorage.setItem(LANG_STORAGE_KEY, currentLocale.code); } catch (_) {}
}

// ─── Conversion pipeline ──────────────────────────────────────────────────────

async function runConversion() {
    const raw = getText(inputEditor);

    // Update input meta (always)
    updateInputMeta(raw);

    if (!raw.trim()) {
        setText(outputEditor, "");
        clearError();
        updateOutputMeta("");
        updateStatusText();
        return;
    }

    // Auto-detect format if user hasn't made an explicit choice recently
    if (state.autoDetected) {
        const detected = await detectFormat(raw);
        if (detected && detected !== state.inputFormat) {
            state.inputFormat = detected;
            state.outputFormat = detected;
            updateActiveTabs();
            setEditorLanguage(inputEditor, state.inputFormat);
            setEditorLanguage(outputEditor, state.outputFormat);
        }
    }

    updateStatusText();

    // Parse with input format
    let parsed;
    try {
        const fmt = await getFormat(state.inputFormat);
        parsed = fmt.parse(raw);
        state.lastParsed = parsed;
        clearError();
        DOM.inputEditorWrap.classList.remove("is-invalid");
    } catch (err) {
        showError(err);
        DOM.inputEditorWrap.classList.add("is-invalid");
        setText(outputEditor, "");
        updateOutputMeta("");
        return;
    }

    // Emit with output format
    let output;
    try {
        const fmt = await getFormat(state.outputFormat);
        const opts = {
            indent: state.indent,
            sortKeys: state.sortKeys,
        };
        output = state.action === "pretty"
            ? fmt.pretty(parsed, opts)
            : fmt.minify(parsed, opts);
    } catch (err) {
        showError(err);
        setText(outputEditor, "");
        updateOutputMeta("");
        return;
    }

    setText(outputEditor, output);
    setEditorLanguage(outputEditor, state.outputFormat);
    updateOutputMeta(output, raw);
}

function updateInputMeta(text) {
    const bytes = new Blob([text]).size;
    const lines = countLines(text);
    state.lastInputSize = bytes;
    if (!text) {
        DOM.inputMeta.textContent = "";
        return;
    }
    DOM.inputMeta.textContent = `${formatBytes(bytes)} · ${lines} ${currentLocale?.ui?.lineUnit || "lines"}`;
}

function updateOutputMeta(text, inputRaw) {
    const bytes = new Blob([text]).size;
    const lines = countLines(text);
    state.lastOutputSize = bytes;
    if (!text) {
        DOM.outputMeta.textContent = "";
        DOM.sizeDelta.textContent = "";
        return;
    }
    DOM.outputMeta.textContent = `${formatBytes(bytes)} · ${lines} ${currentLocale?.ui?.lineUnit || "lines"}`;

    if (inputRaw) {
        const inBytes = new Blob([inputRaw]).size;
        if (inBytes > 0) {
            const diff = bytes - inBytes;
            const pct = Math.round((diff / inBytes) * 100);
            const sign = diff > 0 ? "+" : "";
            DOM.sizeDelta.textContent = `${sign}${pct}%`;
            DOM.sizeDelta.classList.toggle("positive", diff < 0);
            DOM.sizeDelta.classList.toggle("negative", diff > 0);
        }
    } else {
        DOM.sizeDelta.textContent = "";
    }
}

function showError(err) {
    DOM.inputError.textContent = "";

    const errList = err.errors?.length ? err.errors : (err.line != null ? [{
        message: (err.message || String(err)).split("\n")[0],
        line: err.line,
        column: err.column,
        offset: null,
    }] : null);

    if (errList) {
        errList.forEach((e, i) => {
            if (i > 0) DOM.inputError.appendChild(document.createTextNode("\n"));
            const locationText = t(currentLocale?.ui?.errorAt || "line {line}, col {col}", {
                line: e.line, col: e.column ?? "?",
            });
            const msg = (e.code && currentLocale?.ui?.jsonErrors?.[e.code]) || e.message;
            DOM.inputError.appendChild(document.createTextNode("[!] " + msg + " — "));
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "error-location-btn";
            btn.textContent = locationText;
            btn.addEventListener("click", () => {
                const offset = e.offset != null
                    ? e.offset
                    : lineColToOffset(getText(inputEditor), e.line, e.column ?? 1);
                focusAndMoveTo(inputEditor, offset);
            });
            DOM.inputError.appendChild(btn);
        });
    } else {
        DOM.inputError.textContent = (err.message || String(err)).split("\n")[0];
    }

    DOM.inputError.hidden = false;
}

function lineColToOffset(text, line, col) {
    const lines = text.split("\n");
    let offset = 0;
    for (let i = 0; i < line - 1 && i < lines.length; i++) {
        offset += lines[i].length + 1;
    }
    return Math.min(offset + (col - 1), text.length);
}

function clearError() {
    DOM.inputError.textContent = "";
    DOM.inputError.hidden = true;
}

// ─── Clipboard & download ─────────────────────────────────────────────────────

async function copyOutputToClipboard() {
    const text = getText(outputEditor);
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
        flash(DOM.copyOutputBtn);
    } catch (_) {
        // Clipboard not accessible; silent fail
    }
}

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        setText(inputEditor, text);
        state.autoDetected = true;
        await runConversion();
    } catch (_) {
        // Clipboard not accessible; silent fail
    }
}

async function downloadOutput() {
    const text = getText(outputEditor);
    if (!text) return;
    const fmt = await getFormat(state.outputFormat);
    const blob = new Blob([text], { type: `${fmt.mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formatomat.${fmt.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ─── Event binding ────────────────────────────────────────────────────────────

function bindEvents() {
    // Input changes are handled via CodeMirror's updateListener (in createInputEditor)

    DOM.prettyBtn.addEventListener("click", () => {
        state.action = "pretty";
        renderActionButtons();
        runConversion();
    });
    DOM.minifyBtn.addEventListener("click", () => {
        state.action = "minify";
        renderActionButtons();
        runConversion();
    });

    DOM.indentSelect.addEventListener("change", (e) => {
        state.indent = e.target.value;
        runConversion();
    });

    DOM.sortKeysCheckbox.addEventListener("change", (e) => {
        state.sortKeys = e.target.checked;
        runConversion();
    });

    DOM.langSelect.addEventListener("change", async (e) => {
        await setLanguage(e.target.value);
        runConversion();
    });

    DOM.themeSelect.addEventListener("change", (e) => {
        applyTheme(e.target.value, DOM);
        try { localStorage.setItem(THEME_STORAGE_KEY, e.target.value); } catch (_) {}
    });

    DOM.copyOutputBtn.addEventListener("click", copyOutputToClipboard);
    DOM.pasteBtn.addEventListener("click", pasteFromClipboard);
    DOM.downloadBtn.addEventListener("click", downloadOutput);
    DOM.clearInputBtn.addEventListener("click", () => {
        setText(inputEditor, "");
        state.autoDetected = true;
        runConversion();
        inputEditor.focus();
    });

    DOM.expandInputBtn.addEventListener("click", () => {
        const expanding = !DOM.pageWrapper.classList.contains("is-expanded");
        DOM.pageWrapper.classList.toggle("is-expanded", expanding);
        if (!expanding) DOM.pageWrapper.scrollTop = 0;
        const label = expanding
            ? (currentLocale?.ui?.tooltipCollapse || "Collapse")
            : (currentLocale?.ui?.tooltipExpand   || "Expand");
        DOM.expandInputBtn.setAttribute("aria-label", label);
        DOM.expandInputBtn.setAttribute("data-tooltip", label);
        DOM.expandInputBtn.querySelector("svg").innerHTML = expanding
            ? `<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>`
            : `<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>`;
    });

    // Support link in footer
    if (DOM.footerSupport && DOM.supportModal) {
        DOM.footerSupport.addEventListener("click", (e) => {
            if (e.target.closest("#supportLink")) {
                e.preventDefault();
                openModal(DOM.supportModal);
            }
        });
    }

    // About link — open About modal
    DOM.aboutLink?.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(DOM.aboutModal);
    });

    // Privacy / Impressum — open modal, but let non-JS users follow the href
    DOM.privacyLink?.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(DOM.privacyModal);
    });
    DOM.impressumLink?.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(DOM.impressumModal);
    });

    // Modal close via backdrop or [data-modal-close]
    document.querySelectorAll(".modal").forEach((modalEl) => {
        modalEl.addEventListener("click", (event) => {
            if (event.target instanceof HTMLElement && event.target.hasAttribute("data-modal-close")) {
                closeModal();
            }
        });
    });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
    DOM = {
        inputFormatTabs:  document.getElementById("inputFormatTabs"),
        outputFormatTabs: document.getElementById("outputFormatTabs"),
        inputFormatLabel: document.getElementById("inputFormatLabel"),
        outputFormatLabel:document.getElementById("outputFormatLabel"),
        inputStatus:      document.getElementById("inputStatus"),
        inputLabel:       document.getElementById("inputLabel"),
        outputLabel:      document.getElementById("outputLabel"),
        inputEditorWrap:  document.getElementById("inputEditorWrap"),
        outputEditorWrap: document.getElementById("outputEditorWrap"),
        inputMeta:        document.getElementById("inputMeta"),
        outputMeta:       document.getElementById("outputMeta"),
        inputError:       document.getElementById("inputError"),
        expandInputBtn:   document.getElementById("expandInputBtn"),
        pageWrapper:      document.querySelector(".page-wrapper"),
        sizeDelta:        document.getElementById("sizeDelta"),

        actionLabel:      document.getElementById("actionLabel"),
        indentLabel:      document.getElementById("indentLabel"),
        optionsLabel:     document.getElementById("optionsLabel"),
        prettyBtn:        document.getElementById("prettyBtn"),
        minifyBtn:        document.getElementById("minifyBtn"),
        indentGroup:      document.getElementById("indentGroup"),
        indentSelect:     document.getElementById("indentSelect"),
        sortKeysCheckbox: document.getElementById("sortKeysCheckbox"),
        sortKeysLabel:    document.getElementById("sortKeysLabel"),

        copyOutputBtn:    document.getElementById("copyOutputBtn"),
        pasteBtn:         document.getElementById("pasteBtn"),
        downloadBtn:      document.getElementById("downloadBtn"),
        clearInputBtn:    document.getElementById("clearInputBtn"),

        metaThemeColor:   document.querySelector('meta[name="theme-color"]'),
        langSelect:       document.getElementById("languageSelect"),
        themeSelect:      document.getElementById("themeSelect"),
        aboutLink:        document.getElementById("aboutLink"),
        footerSupport:    document.getElementById("footerSupport"),
        impressumLink:    document.getElementById("impressumLink"),
        privacyLink:      document.getElementById("privacyLink"),

        supportModal:      document.getElementById("supportModal"),
        supportModalTitle: document.getElementById("supportModalTitle"),
        supportModalBody:  document.getElementById("supportModalBody"),
        aboutModal:       document.getElementById("aboutModal"),
        aboutModalTitle:  document.getElementById("aboutModalTitle"),
        aboutModalBody:   document.getElementById("aboutModalBody"),
        privacyModal:     document.getElementById("privacyModal"),
        privacyModalTitle:document.getElementById("privacyModalTitle"),
        privacyModalBody: document.getElementById("privacyModalBody"),
        impressumModal:   document.getElementById("impressumModal"),
        impressumModalTitle: document.getElementById("impressumModalTitle"),
        impressumModalBody:  document.getElementById("impressumModalBody"),
    };

    renderThemeSelect();
    renderLanguageSelect();
    renderFormatTabs();
    renderActionButtons();

    applyTheme(getInitialTheme(THEME_STORAGE_KEY), DOM);
    await setLanguage(getInitialLanguage(LANG_STORAGE_KEY));

    // Create CodeMirror editors
    const debouncedRun = debounce(runConversion, 150);
    inputEditor = createInputEditor(DOM.inputEditorWrap, state.inputFormat, () => {
        if (!state.autoDetected && !getText(inputEditor).trim()) state.autoDetected = true;
        debouncedRun();
    });
    outputEditor = createOutputEditor(DOM.outputEditorWrap, state.outputFormat);

    // Load sample data on first run
    setText(inputEditor, currentLocale.ui.sample_json || "");
    state.autoDetected = true;

    bindEvents();
    await runConversion();
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(dbg);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init().catch(console.error));
} else {
    init().catch(console.error);
}
