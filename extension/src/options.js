const DEFAULT_URL = "https://formatomat.net/";

// Alle mit data-i18n markierten Elemente lokalisieren.
document.documentElement.lang = (chrome.i18n.getUILanguage() || "en").split("-")[0];
for (const el of document.querySelectorAll("[data-i18n]")) {
  const msg = chrome.i18n.getMessage(el.dataset.i18n);
  if (msg) el.textContent = msg;
}
document.title = chrome.i18n.getMessage("opt_title") || document.title;

const input = document.getElementById("url");
const statusEl = document.getElementById("status");

// Aktuellen Wert laden
chrome.storage.sync.get("targetUrl", ({ targetUrl }) => {
  input.value = targetUrl || "";
  input.placeholder = DEFAULT_URL;
});

document.getElementById("save").addEventListener("click", () => {
  const v = input.value.trim();
  if (v && !/^https?:\/\//i.test(v)) {
    setStatus(chrome.i18n.getMessage("opt_invalid_url"), false);
    return;
  }
  chrome.storage.sync.set({ targetUrl: v }, () => {
    setStatus(chrome.i18n.getMessage(v ? "opt_saved" : "opt_reset_done"), true);
  });
});

document.getElementById("reset").addEventListener("click", () => {
  chrome.storage.sync.remove("targetUrl", () => {
    input.value = "";
    setStatus(chrome.i18n.getMessage("opt_reset_done"), true);
  });
});

function setStatus(msg, ok) {
  statusEl.textContent = msg;
  statusEl.style.color = ok ? "#3aa655" : "#c94f4f";
  setTimeout(() => (statusEl.textContent = ""), 2500);
}
