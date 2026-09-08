// ============================================================================
//  Formatomat — Browser extension hint
// ============================================================================
//
//  Renders the dismissible banner that points Chromium users at the companion
//  extension. Knows nothing about the app beyond a container element, the
//  store URL and the current locale strings.

const STATE_KEY = "formatomat_extension_hint";
const DISMISSED = "dismissed";
const INSTALLED = "installed";

function readState() {
    try {
        return localStorage.getItem(STATE_KEY);
    } catch (_) {
        return null;
    }
}

function writeState(value) {
    try {
        localStorage.setItem(STATE_KEY, value);
    } catch (_) {}
}

// Only Chromium browsers can install from the Chrome Web Store. Prefer the
// structured brand list; `window.chrome` is the fallback for browsers without
// userAgentData (and is absent in Firefox/Safari page contexts).
export function isExtensionCapableBrowser() {
    const brands = navigator.userAgentData?.brands;
    if (Array.isArray(brands)) return brands.some((b) => b.brand === "Chromium");
    return Boolean(window.chrome);
}

// The extension talking to us is the only reliable "is it installed?" signal we
// get, so remember it: from then on the hint stays gone for good.
export function markExtensionDetected(container) {
    writeState(INSTALLED);
    if (container) {
        container.textContent = "";
        container.hidden = true;
    }
}

// (Re-)renders the hint into `container`. Safe to call on every locale switch:
// it rebuilds the contents and re-applies the eligibility rules.
export function renderExtensionHint(container, { storeUrl, ui = {} } = {}) {
    if (!container) return;

    container.textContent = "";
    container.hidden = true;

    if (!storeUrl) return;
    if (!isExtensionCapableBrowser()) return;
    if (readState()) return;
    if (!ui.extensionHintText) return;

    const text = document.createElement("span");
    text.className = "extension-hint-text";
    text.textContent = ui.extensionHintText + " ";

    const link = document.createElement("a");
    link.href = storeUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = ui.extensionHintLink || "";
    text.appendChild(link);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "extension-hint-close";
    const closeLabel = ui.extensionHintDismiss || "Close";
    close.setAttribute("aria-label", closeLabel);
    close.setAttribute("title", closeLabel);
    close.textContent = "×";
    close.addEventListener("click", () => {
        writeState(DISMISSED);
        container.textContent = "";
        container.hidden = true;
    });

    container.appendChild(text);
    container.appendChild(close);
    container.hidden = false;
}
