// Brücke zwischen Extension-Speicher und der Formatomat-App.
// Läuft auf https://formatomat.net/* und liegt in einer eigenen JS-Welt;
// die Übergabe an die Seite erfolgt daher per window.postMessage.
(function () {
  let consumed = false;

  function consume() {
    if (consumed) return;
    chrome.storage.local.get("formatomatPayload", (data) => {
      const p = data && data.formatomatPayload;
      if (!p) return;
      consumed = true;
      chrome.storage.local.remove("formatomatPayload");
      window.postMessage(
        {
          source: "formatomat-extension",
          text: p.text,
          format: p.format,
          ts: p.ts
        },
        window.location.origin
      );
    });
  }

  // Handshake: die App meldet sich mit "ready", dann schicken wir die Payload.
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== window.location.origin) return;
    const d = event.data;
    if (d && d.source === "formatomat-app" && d.type === "ready") consume();
  });

  // Fallback für den Fall, dass der Tab schon offen war.
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "FORMATOMAT_CONSUME") {
      consumed = false;
      consume();
    }
  });
})();
