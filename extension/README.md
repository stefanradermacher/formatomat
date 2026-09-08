# Formatomat-Erweiterung „An Formatomat senden"

Chrome-Erweiterung, die JSON/YAML/XML/TOML/INI/PHP-Array von der aktuellen Seite
per Klick an Formatomat übergibt. Alles unter `src/` ist die **einzige Quelle**;
das Store-Paket wird daraus abgeleitet.

## Struktur
```
extension/
├── src/                      # Single Source – zugleich der Dev-Build
│   ├── manifest.json         # maßgeblich für Name, Version, Beschreibung
│   ├── background.js         # Service-Worker (Auslesen, Zwischenspeichern, Öffnen)
│   ├── content-formatomat.js # Brücke auf der Zielseite (postMessage)
│   ├── options.html/.js      # Ziel-URL-Einstellung (nur Dev/lokales Testen)
│   ├── _locales/<12>/…       # Übersetzungen (en ist default_locale)
│   └── icons/                # icon16/32/48/128.png + favicon.svg (Quelle)
├── scripts/
│   ├── build.mjs             # erzeugt das Store-Paket aus src/
│   └── make-icons.sh         # PNGs aus favicon.svg neu erzeugen
└── dist/                     # Build-Ausgabe (git-ignoriert)
```

## Entwickeln (Dev-Build)
`src/` **direkt** als entpackte Erweiterung laden – kein Build nötig:

1. `chrome://extensions` → Entwicklermodus an
2. „Entpackte Erweiterung laden" → den Ordner `src/` wählen

Der Dev-Build enthält zusätzlich `localhost`/`127.0.0.1` in den Berechtigungen
und die Options-Seite, um eine abweichende Ziel-URL (z. B. `http://localhost:5173/`)
zu setzen und lokal gegen einen eigenen Formatomat-Server zu testen.

## Store-Paket bauen
Von der Repo-Wurzel aus:

```
npm run build:ext                  # oder: node extension/scripts/build.mjs
```
Ergebnis: `extension/dist/formatomat-extension-store.zip` (mit `manifest.json` auf
Root-Ebene – Pflicht für den Chrome Web Store). Der Build leitet die Release-
Variante aus `src/` ab und lässt dabei weg:

- `localhost`/`127.0.0.1` aus `host_permissions` und `content_scripts.matches`
- die Options-Seite (`options.html`/`options.js`, `options_ui`)
- ungenutzte `opt_*`-Übersetzungen
- die Quell-`favicon.svg`

Die `background.js` ist in beiden Varianten identisch: Ohne Options-Seite wird
nie eine Ziel-URL gesetzt, daher greift automatisch der Default `formatomat.net`.

Voraussetzung fürs Zippen: das `zip`-CLI (auf macOS/Linux vorhanden).
`build.mjs` hat keine npm-Abhängigkeiten — es gibt hier nichts zu installieren.
Der `build:ext`-Eintrag steht in der `package.json` der Repo-Wurzel, damit es
im Projekt nur einen Ort für Werkzeuge gibt.

## Version erhöhen
Vor einem Store-Update **nur** `version` in `src/manifest.json` hochzählen
(z. B. `1.0.0` → `1.0.1`). Der Build übernimmt den Wert automatisch. Der Store
verlangt für jedes Update eine höhere Version als die zuletzt veröffentlichte.

## Icons neu erzeugen
```
extension/scripts/make-icons.sh                 # aus src/icons/favicon.svg
extension/scripts/make-icons.sh pfad/zur/quelle.svg
```
Benötigt ImageMagick. Chrome nutzt fürs Toolbar-Icon nur PNG, kein SVG.

## Gegenstück in Formatomat
Die Erweiterung übergibt den Inhalt per `postMessage` an die Web-App. Die App
muss auf Nachrichten mit `source: "formatomat-extension"` lauschen (Origin
prüfen!) und nach der Initialisierung einmal
`{ source: "formatomat-app", type: "ready" }` senden. Empfangene Felder:
`text` und `format` (`json|yaml|xml|toml|ini|php|auto`, nur ein Hinweis).
