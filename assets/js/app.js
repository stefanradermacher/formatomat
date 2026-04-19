// ============================================================================
//  Formatomat — Entry point
// ============================================================================

import { state } from "./state.js";
import { FORMATS, FORMAT_LIST, getFormat, detectFormat } from "./formats.js";
import { THEMES, applyTheme, getInitialTheme } from "./theme.js";
import { openModal, closeModal } from "./modals.js";
import {
    SUPPORTED_LOCALES,
    getInitialLanguage, switchLocale, t,
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

const OWNER_ADDRESS = [
    "Stefan Radermacher",
    "Siegburger Straße 171",
    "50679 Köln",
    "Deutschland",
];
const EMAIL = ["info", "formatomat.net"].join("@");
const DONATE_PAYPAL_URL = "https://paypal.me/formatomat";

const CONFIG = { OWNER_ADDRESS, EMAIL, DONATE_PAYPAL_URL };
const LOCALE_HELPERS = {
    afterLocaleApplied(ui) {
        updateStatusText();
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
    },
};

let DOM;

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
                const oldSample = state.currentLocale?.ui[`sample_${state.inputFormat}`] ?? "";
                const current   = getText(inputEditor).trim();
                state.inputFormat = id;
                state.autoDetected = false;
                updateStatusText();
                if (inputEditor) setEditorLanguage(inputEditor, id);
                if (!current || current === oldSample.trim()) {
                    const newSample = state.currentLocale?.ui[`sample_${id}`] ?? "";
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
    if (!state.currentLocale) return;
    const ui = state.currentLocale.ui;
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

function populateThemeSelect() {
    DOM.themeSelect.textContent = "";
    Object.values(THEMES).forEach((t) => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = t.label;
        DOM.themeSelect.appendChild(opt);
    });
}

function populateLanguageSelect() {
    DOM.langSelect.textContent = "";
    SUPPORTED_LOCALES.forEach(({ code, name }) => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = name;
        DOM.langSelect.appendChild(opt);
    });
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
    DOM.inputMeta.textContent = `${formatBytes(bytes)} · ${lines} ${state.currentLocale?.ui?.lineUnit || "lines"}`;
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
    DOM.outputMeta.textContent = `${formatBytes(bytes)} · ${lines} ${state.currentLocale?.ui?.lineUnit || "lines"}`;

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
            const locationText = t(state.currentLocale?.ui?.errorAt || "line {line}, col {col}", {
                line: e.line, col: e.column ?? "?",
            });
            const msg = (e.code && state.currentLocale?.ui?.jsonErrors?.[e.code]) || e.message;
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
        await switchLocale(e.target.value, DOM, CONFIG, LANG_STORAGE_KEY, LOCALE_HELPERS);
        renderFormatTabs();
        renderActionButtons();
        updateStatusText();
        await runConversion();
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
            ? (state.currentLocale?.ui?.tooltipCollapse || "Collapse")
            : (state.currentLocale?.ui?.tooltipExpand   || "Expand");
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

    populateThemeSelect();
    populateLanguageSelect();
    renderFormatTabs();
    renderActionButtons();

    applyTheme(getInitialTheme(THEME_STORAGE_KEY), DOM);
    await switchLocale(getInitialLanguage(LANG_STORAGE_KEY), DOM, CONFIG, LANG_STORAGE_KEY, LOCALE_HELPERS);

    // Create CodeMirror editors
    const debouncedRun = debounce(runConversion, 150);
    inputEditor = createInputEditor(DOM.inputEditorWrap, state.inputFormat, () => {
        if (!state.autoDetected && !getText(inputEditor).trim()) state.autoDetected = true;
        debouncedRun();
    });
    outputEditor = createOutputEditor(DOM.outputEditorWrap, state.outputFormat);

    // Load sample data on first run
    setText(inputEditor, state.currentLocale.ui.sample_json || "");
    state.autoDetected = true;

    bindEvents();
    await runConversion();
}

// ─── Global error UI ──────────────────────────────────────────────────────────

function showFatalError(err) {
    console.error(err);
    const target = document.getElementById("fatalError");
    if (!target) return;
    target.hidden = false;
    target.textContent = "A fatal error occurred while starting Formatomat.";
}

window.addEventListener("error", (event) => showFatalError(event.error || event.message));
window.addEventListener("unhandledrejection", (event) => showFatalError(event.reason));

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(dbg);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init().catch(showFatalError));
} else {
    init().catch(showFatalError);
}
