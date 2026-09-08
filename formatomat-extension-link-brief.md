# Implementierungs-Briefing: Erweiterung auf formatomat.net verlinken

## Ziel
Auf formatomat.net dezent auf die Chrome-Erweiterung „An Formatomat senden"
hinweisen, damit Besucher sie finden und installieren können. Der Hinweis soll
sich ins bestehende Layout/Theme einfügen und Nutzer anderer Browser nicht
verwirren.

## Voraussetzung / Platzhalter
Die endgültige Store-URL steht erst nach der Freigabe fest und hat die Form:

    https://chromewebstore.google.com/detail/<slug>/<EXTENSION_ID>

Im Code als Konstante `STORE_URL` hinterlegen und nach Veröffentlichung den
echten Wert einsetzen. (Die `<EXTENSION_ID>` findest du im Developer Dashboard
bzw. in der veröffentlichten Listing-URL.)

## Umzusetzen

### 1. Footer-Link (Minimalvariante, immer sinnvoll)
Den bestehenden Footer neben „Über · Impressum · Datenschutz · GitHub" um einen
Eintrag ergänzen, z. B. „Chrome-Erweiterung" bzw. „Browser-Erweiterung", der auf
`STORE_URL` zeigt (`target="_blank" rel="noopener"`). Gleicher Stil wie die
übrigen Footer-Links.

### 2. Optionaler Hinweis-Banner (nur in Chromium-Browsern)
Zusätzlich ein dezenter, einmal wegklickbarer Hinweis („Tipp: Mit der
Erweiterung Code direkt von jeder Seite hierher senden."), der **nur** in
Chromium-Browsern erscheint, in denen die Erweiterung installierbar ist.

- Erkennung ohne unsichere User-Agent-Prüfung: `Boolean(window.chrome)` bzw.
  Feature-Checks; Firefox/Safari damit ausschließen.
- „Bereits installiert?" lässt sich nicht zuverlässig direkt prüfen. Pragmatisch:
  Da die Erweiterung ohnehin ein `ready`-Signal an die Seite sendet (siehe
  bestehender Import-Mechanismus / Nachrichten-Kontrakt), kann die Seite den
  Hinweis ausblenden, sobald dieses Signal einmal empfangen wurde — dann ist die
  Erweiterung nachweislich aktiv.
- Wegklick-Zustand in `localStorage` merken, damit der Hinweis nicht bei jedem
  Besuch wiederkommt.

Der Footer-Link (1) ist Pflicht und reicht als Minimallösung; der Banner (2) ist
optionales „nice to have".

## Stil & Konsistenz
- Bestehende Theme-Variablen/CSS-Klassen verwenden (Industrial-/Metal-Optik).
- Keine neue Abhängigkeit einführen; passend zu den vorhandenen ES-Modulen
  kapseln (z. B. kleines Modul `extension-hint.js`), aktiviert aus dem Bootstrap.
- Barrierearm: echter `<a>`-Link, ausreichender Kontrast, Banner per Tastatur
  schließbar.

## Nicht-Ziele
- Keine automatische Installation anstoßen oder erzwingen.
- Nutzer nicht-unterstützter Browser nicht mit totem Link/Banner behelligen.
- Keine Tracking-/Analytics-Parameter an die Store-URL hängen.

## Text-Bausteine (DE / EN, anpassbar, in die anderen Sprachen übersetzen)
- Footer DE: „Chrome-Erweiterung" · EN: „Chrome extension"
- Banner DE: „Tipp: Mit der Formatomat-Erweiterung sendest du Code direkt von jeder
  Seite an Formatomat. Zur Erweiterung →"
- Banner EN: „Tip: The Formatomat extension sends code straight from any page to Formatomat.
  Get the extension →"

## Nach der Freigabe (Checkliste)
1. `STORE_URL` mit der echten Listing-URL füllen.
2. Footer-Link live schalten.
3. Optional Banner aktivieren und in einem Chromium-Browser testen
   (installiert / nicht installiert / weggeklickt).
