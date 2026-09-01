// ============================================================================
//  Formatomat — Extension import bridge
// ============================================================================
//
//  Receives content sent by the companion Chrome extension via postMessage
//  (same origin, isolated JS world) and hands it to the app's normal
//  "load content + detect format" path. This module owns only the message
//  contract; it knows nothing about the editor or app state.

const EXTENSION_SOURCE = "formatomat-extension";
const APP_SOURCE = "formatomat-app";

// Activate the import bridge: register the message listener, then announce
// readiness so the extension knows it may send its payload (avoids a load
// race). `loadIntoEditor(text, format)` is the app's existing load path.
export function enableExtensionImport(loadIntoEditor) {
    window.addEventListener("message", (event) => {
        // Reject anything not from this very window/origin (blocks injection
        // from foreign iframes).
        if (event.origin !== window.location.origin || event.source !== window) return;

        const data = event.data;
        if (!data || data.source !== EXTENSION_SOURCE) return;
        if (typeof data.text !== "string") return;

        loadIntoEditor(data.text, data.format);
    });

    // Handshake: only after the listener is registered do we invite payloads.
    window.postMessage({ source: APP_SOURCE, type: "ready" }, window.location.origin);
}