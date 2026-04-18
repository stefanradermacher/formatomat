export default {
    code: "de",
    name: "Deutsch",
    htmlLang: "de-DE",

    ui: {
        tagline:           "Der Automat für alle Formate.",
        inputLabel:        "Eingabe",
        outputLabel:       "Ausgabe",
        inputFormatLabel:  "Eingabe",
        outputFormatLabel: "Ausgabe",
        actionLabel:       "Aktion",
        indentLabel:       "Einrückung",
        indent2:           "2 Leerzeichen",
        indent4:           "4 Leerzeichen",
        indentTab:         "Tabulator",
        optionsLabel:      "Optionen",

        actionPretty:      "Lesbar",
        actionMinify:      "Kompakt",

        sortKeys:           "Schlüssel sortieren",
        autoDetected:      "automatisch erkannt",
        manual:            "manuell",

        inputPlaceholder:  "Daten hier einfügen oder eingeben…",
        outputPlaceholder: "Das formatierte Ergebnis erscheint hier.",

        empty:             "—",
        byteUnit:          "B",
        lineUnit:          "Zeilen",

        tooltipPaste:      "Aus Zwischenablage einfügen",
        tooltipClearInput: "Eingabe leeren",
        tooltipCopy:       "In Zwischenablage kopieren",
        tooltipDownload:   "Herunterladen",
        tooltipExpand:     "Ausklappen",
        tooltipCollapse:   "Einklappen",

        copySuccess:       "Kopiert!",
        copyFailed:        "Kopieren fehlgeschlagen",

        errorAt:           "Zeile {line}, Sp. {col}",

        jsonErrors: {
            InvalidSymbol:           "Ungültiges Symbol",
            InvalidNumberFormat:     "Ungültiges Zahlenformat",
            PropertyNameExpected:    "Eigenschaftsname erwartet",
            ValueExpected:           "Wert erwartet",
            ColonExpected:           "Doppelpunkt erwartet",
            CommaExpected:           "Komma erwartet",
            CloseBraceExpected:      "Schließende geschweifte Klammer erwartet",
            CloseBracketExpected:    "Schließende eckige Klammer erwartet",
            EndOfFileExpected:       "Dateiende erwartet",
            InvalidCommentToken:     "Ungültiger Kommentar",
            UnexpectedEndOfComment:  "Unerwartetes Kommentarende",
            UnexpectedEndOfString:   "Unerwartetes Ende der Zeichenkette",
            UnexpectedEndOfNumber:   "Unerwartetes Ende der Zahl",
            InvalidUnicode:          "Ungültiges Unicode-Zeichen",
            InvalidEscapeCharacter:  "Ungültiges Escape-Zeichen",
            InvalidCharacter:        "Ungültiges Zeichen",
        },

        footerSupportText: "Der Formatomat ist kostenlos und nicht-kommerziell. Wenn du die Entwicklung unterstützen möchtest, {link}.",
        footerSupportLink: "klicke hier",

        supportTitle:      "Formatomat unterstützen",
        supportIntro:      "Der Formatomat ist ein nicht-kommerzielles Nebenprojekt und bleibt dauerhaft kostenlos.",
        supportP1:         "Wenn du die laufende Entwicklung und die Hostingkosten dennoch unterstützen möchtest, kannst du eine kleine Spende senden.",
        supportPaypalLabel: "Per PayPal spenden",

        aboutLink:         "Über",
        impressumLink:     "Impressum",
        privacyLink:       "Datenschutz",

        aboutTitle:        "Über den Formatomat",
        aboutP1:           "Der Formatomat ist ein schnelles, datenschutzfreundliches Werkzeug zum Konvertieren, Schönformatieren und Verkleinern strukturierter Datenformate. Alle Verarbeitung findet lokal in deinem Browser statt — deine Daten verlassen dein Gerät nicht.",
        aboutP2:           "Unterstützte Formate: JSON, YAML, XML, TOML, INI und PHP.",
        aboutP3:           "Open Source, MIT-lizenziert.",
        aboutDepsLabel:    "Verwendete Open-Source-Komponenten:",

        privacyTitle:      "Datenschutz & Datennutzung",
        privacyP1:         "Der Formatomat speichert keine personenbezogenen Daten von dir auf dem Server.",
        privacyP2:         "Alle Verarbeitung (Parsing, Formatieren, Konvertieren) findet ausschließlich lokal in deinem Browser statt. Deine Eingabedaten verlassen dein Gerät nicht.",
        privacyP3:         "Der Formatomat verwendet kein Tracking, keine Analytics und keine Cookies von Drittanbietern.",
        privacyP4:         "Zur Bequemlichkeit werden einige Einstellungen (z. B. Sprache und Theme) lokal im Speicher deines Browsers abgelegt. Diese Daten verlassen dein Gerät nicht und werden gelöscht, wenn du die Browserdaten entfernst.",

        impressumTitle:    "Impressum",
        impressumProviderLabel: "Dienstanbieter",
        impressumContactLabel:  "Kontakt",
        impressumEmailLabel:    "E-Mail: ",
        impressumP3:       "Der Formatomat ist ein privates, nicht-kommerzielles Projekt. Alle Inhalte werden ohne Gewähr und ohne Anspruch auf Vollständigkeit oder Richtigkeit bereitgestellt.",
        impressumP4:       "Verlinkte externe Seiten werden ausschließlich als Service angeboten. Für deren Inhalte sind ausschließlich die jeweiligen Betreiber verantwortlich.",

        sample_json: `{
  "name": "Formatomat",
  "version": 1,
  "features": ["lesbar", "kompakt", "konvertieren"],
  "active": true
}`,

        sample_yaml: `name: Formatomat
version: 1
features:
  - lesbar
  - kompakt
  - konvertieren
active: true`,

        sample_xml: `<?xml version="1.0" encoding="UTF-8"?>
<app name="Formatomat" version="1">
  <features>
    <feature>pretty</feature>
    <feature>minify</feature>
    <feature>convert</feature>
  </features>
  <active>true</active>
</app>`,

        sample_toml: `name = "Formatomat"
version = 1
active = true

[features]
list = ["pretty", "minify", "convert"]`,

        sample_phparray: `<?php
return [
    'name' => 'Formatomat',
    'version' => 1,
    'active' => true,
    'features' => ['lesbar', 'kompakt', 'konvertieren'],
];`,

        sample_ini: `; Anwendungseinstellungen
[app]
name = Formatomat
version = 1
active = true

[features]
list = lesbar, kompakt, konvertieren`,
    },
};
