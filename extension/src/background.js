const DEFAULT_URL = "https://formatomat.net/";

// --- Konfiguration --------------------------------------------------------

async function getTargetUrl() {
  const { targetUrl } = await chrome.storage.sync.get("targetUrl");
  return targetUrl && /^https?:\/\//i.test(targetUrl) ? targetUrl : DEFAULT_URL;
}

// Match-Pattern (ohne Port) für tabs.query, aus der Ziel-URL abgeleitet.
function tabQueryPattern(urlStr) {
  try {
    const u = new URL(urlStr);
    return `${u.protocol}//${u.hostname}/*`;
  } catch (e) {
    return "https://formatomat.net/*";
  }
}

// Nur diese Schemata sind für Skript-Injektion zugänglich. Interne Seiten
// (chrome://, vivaldi://, about:, view-source:, Neuer-Tab, Web Store …) sind
// gesperrt und würden einen Fehler werfen.
function canInject(url) {
  if (!url) return false;
  if (!/^(https?|file):\/\//i.test(url)) return false;
  // Der Chrome Web Store ist zwar https, blockiert Injektion aber ebenfalls.
  return !/^https:\/\/(chrome\.google\.com\/webstore|chromewebstore\.google\.com)\//i.test(url);
}

// --- Auslöser -------------------------------------------------------------

// Klick auf das Symbol in der Toolbar
chrome.action.onClicked.addListener((tab) => sendToFormatomat(tab));

// Rechtsklick-Menü (Seite oder markierter Text)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "send-to-formatomat",
    title: chrome.i18n.getMessage("send_to_formatomat"),
    contexts: ["page", "selection"]
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "send-to-formatomat") sendToFormatomat(tab);
});

// --- Ablauf ---------------------------------------------------------------

async function sendToFormatomat(tab) {
  if (!tab || !tab.id) return;

  // Auf internen/gesperrten Seiten gar nicht erst injizieren.
  if (!canInject(tab.url)) {
    flashBadge(tab.id, false);
    return;
  }

  let results = [];
  try {
    // In ALLE Frames injizieren, damit auch eine Auswahl in einem <iframe>
    // gefunden wird. Jeder Frame liefert seinen besten Treffer mit Priorität.
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: grabInFrame
    });
  } catch (e) {
    // Kein roter Fehler in der Erweiterungsliste – nur stilles Feedback.
    console.debug("Formatomat: Seiteninhalt nicht lesbar:", e && e.message);
    flashBadge(tab.id, false);
    return;
  }

  // Höchste Priorität über alle Frames gewinnt: eine Markierung (egal in
  // welchem Frame) schlägt jeden strukturellen Fallback.
  const best = results
    .map((r) => r && r.result)
    .filter((r) => r && r.text && r.text.trim())
    .sort((a, b) => b.priority - a.priority)[0];

  const text = best ? best.text : "";
  if (!text.trim()) {
    flashBadge(tab.id, false); // nichts Brauchbares gefunden
    return;
  }

  const payload = {
    text: text,
    format: detectFormat(text), // nur ein Hinweis, siehe unten
    ts: Date.now()
  };
  await chrome.storage.local.set({ formatomatPayload: payload });
  flashBadge(tab.id, true);

  const target = await getTargetUrl();

  // Bereits offenen Ziel-Tab wiederverwenden, sonst neu öffnen.
  const open = await chrome.tabs.query({ url: tabQueryPattern(target) });
  if (open.length) {
    const t = open[0];
    await chrome.tabs.update(t.id, { active: true });
    chrome.windows.update(t.windowId, { focused: true });
    try {
      await chrome.tabs.sendMessage(t.id, { type: "FORMATOMAT_CONSUME" });
    } catch (e) {
      // Content-Script noch nicht bereit -> Reload zieht die Payload beim Laden.
      chrome.tabs.reload(t.id);
    }
  } else {
    chrome.tabs.create({ url: target });
  }
}

// Läuft IM Kontext jedes Frames (muss eigenständig sein, keine Closures).
// Rückgabe: { priority, text }. Höhere Priorität = besserer Treffer.
function grabInFrame() {
  // 1) Auswahl innerhalb eines Eingabefelds (textarea/input)
  const el = document.activeElement;
  if (
    el &&
    (el.tagName === "TEXTAREA" ||
      (el.tagName === "INPUT" &&
        /^(text|search|url|tel|email|number|password)$/i.test(el.type || "text")))
  ) {
    const s = el.selectionStart, e = el.selectionEnd;
    if (s != null && e != null && e > s) {
      const t = el.value.substring(s, e);
      if (t.trim()) return { priority: 3, text: t };
    }
  }

  // 2) Normale Textauswahl im Dokument
  const sel = window.getSelection && window.getSelection().toString();
  if (sel && sel.trim()) return { priority: 3, text: sel };

  // 3) Strukturelle Fallbacks (nur sinnvoll, wenn nichts markiert ist)
  const pre = document.querySelector("pre");
  if (pre && pre.innerText.trim()) return { priority: 2, text: pre.innerText };

  const code = document.querySelector("code");
  if (code && code.innerText.trim()) return { priority: 1, text: code.innerText };

  const body = document.body ? document.body.innerText : "";
  if (body.trim()) return { priority: 0, text: body };

  return { priority: -1, text: "" };
}

// Kurze visuelle Rückmeldung am Extension-Symbol.
function flashBadge(tabId, ok) {
  const text = ok ? "\u2713" : "?"; // ✓ oder ?
  chrome.action.setBadgeBackgroundColor({ color: ok ? "#3aa655" : "#c94f4f" });
  chrome.action.setBadgeText({ text, tabId });
  setTimeout(() => chrome.action.setBadgeText({ text: "", tabId }), ok ? 1200 : 2500);
}

// Grobe Heuristik – nur als Vorauswahl gedacht. Die verlässliche
// Formaterkennung soll weiterhin Formatomat selbst übernehmen.
function detectFormat(t) {
  const s = t.trim();
  if (/^<\?php/.test(s) || /\barray\s*\(/i.test(s)) return "php";
  if (/^</.test(s)) return "xml";
  if (/^[{[]/.test(s)) return "json";
  const hasSection = /^\s*\[[^\]]+]\s*$/m.test(s);
  const hasKV = /^\s*[\w.\-"']+\s*=\s*/m.test(s);
  if (hasSection && hasKV) return "toml"; // vs. INI kaum sicher trennbar
  if (hasKV) return "ini";
  if (/^\s*[\w"'\-]+\s*:\s/m.test(s) || /^\s*-\s+/m.test(s)) return "yaml";
  return "auto";
}
