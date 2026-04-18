export default {
    code: "pl",
    name: "Polski",
    htmlLang: "pl-PL",

    ui: {
        tagline:           "Automat dla wszystkich formatów.",
        inputLabel:        "Wejście",
        outputLabel:       "Wyjście",
        inputFormatLabel:  "Wejście",
        outputFormatLabel: "Wyjście",
        actionLabel:       "Akcja",
        indentLabel:       "Wcięcie",
        indent2:           "2 spacje",
        indent4:           "4 spacje",
        indentTab:         "Tabulator",
        optionsLabel:      "Opcje",

        actionPretty:      "Czytelny",
        actionMinify:      "Kompakt",

        sortKeys:          "Sortuj klucze",
        autoDetected:      "wykryto automatycznie",
        manual:            "ręcznie",

        inputPlaceholder:  "Wklej lub wpisz dane tutaj…",
        outputPlaceholder: "Sformatowany wynik pojawi się tutaj.",

        empty:             "—",
        byteUnit:          "B",
        lineUnit:          "wierszy",

        tooltipPaste:      "Wklej ze schowka",
        tooltipClearInput: "Wyczyść wejście",
        tooltipCopy:       "Kopiuj do schowka",
        tooltipDownload:   "Pobierz",
        tooltipExpand:     "Rozwiń",
        tooltipCollapse:   "Zwiń",

        copySuccess:       "Skopiowano!",
        copyFailed:        "Błąd kopiowania",

        errorAt:           "wiersz {line}, kol {col}",

        jsonErrors: {
            InvalidSymbol:           "Nieprawidłowy symbol",
            InvalidNumberFormat:     "Nieprawidłowy format liczby",
            PropertyNameExpected:    "Oczekiwano nazwy właściwości",
            ValueExpected:           "Oczekiwano wartości",
            ColonExpected:           "Oczekiwano dwukropka",
            CommaExpected:           "Oczekiwano przecinka",
            CloseBraceExpected:      "Oczekiwano zamykającego nawiasu klamrowego",
            CloseBracketExpected:    "Oczekiwano zamykającego nawiasu kwadratowego",
            EndOfFileExpected:       "Oczekiwano końca pliku",
            InvalidCommentToken:     "Nieprawidłowy komentarz",
            UnexpectedEndOfComment:  "Nieoczekiwany koniec komentarza",
            UnexpectedEndOfString:   "Nieoczekiwany koniec ciągu znaków",
            UnexpectedEndOfNumber:   "Nieoczekiwany koniec liczby",
            InvalidUnicode:          "Nieprawidłowy znak Unicode",
            InvalidEscapeCharacter:  "Nieprawidłowy znak ucieczki",
            InvalidCharacter:        "Nieprawidłowy znak",
        },

        footerSupportText: "Formatomat jest projektem niekomercyjnym i pozostanie bezpłatny. Jeśli chcesz wesprzeć rozwój, {link}.",
        footerSupportLink: "kliknij tutaj",

        supportTitle:      "Wesprzyj Formatomat",
        supportIntro:      "Formatomat to prywatny projekt niekomercyjny i zawsze pozostanie bezpłatny.",
        supportP1:         "Jeśli chcesz wesprzeć rozwój i koszty hostingu, możesz przekazać niewielką darowiznę.",
        supportPaypalLabel: "Przekaż darowiznę przez PayPal",

        aboutLink:         "O projekcie",
        sourceLink:        "Kod źródłowy",
        impressumLink:     "Informacje prawne",
        privacyLink:       "Prywatność",

        aboutTitle:        "O Formatomacie",
        aboutP1:           "Formatomat to szybkie narzędzie dbające o prywatność, służące do konwertowania, formatowania i kompresowania danych strukturalnych. Całe przetwarzanie odbywa się lokalnie w Twojej przeglądarce — Twoje dane nigdy nie opuszczają urządzenia.",
        aboutP2:           "Obsługiwane formaty: JSON, YAML, XML, TOML, INI i PHP.",
        aboutP3:           "Open source, licencja MIT.",
        aboutDepsLabel:    "Użyte komponenty open source:",

        privacyTitle:      "Prywatność i wykorzystanie danych",
        privacyP1:         "Formatomat nie przechowuje żadnych danych osobowych na serwerze.",
        privacyP2:         "Formatomat nie używa śledzenia, analityki ani plików cookie stron trzecich.",
        privacyP3:         "Dla wygody niektóre preferencje (język, motyw) są przechowywane w lokalnym magazynie przeglądarki. Dane te nigdy nie opuszczają Twojego urządzenia.",
        privacyP4:         "Całe przetwarzanie (parsowanie, formatowanie, konwersja) odbywa się lokalnie w Twojej przeglądarce. Wprowadzone dane nigdy nie opuszczają Twojego urządzenia.",

        impressumTitle:    "Informacje prawne",
        impressumProviderLabel: "Usługodawca",
        impressumContactLabel:  "Kontakt",
        impressumEmailLabel:    "E-mail: ",
        impressumP3:       "Formatomat jest prywatnym, niekomercyjnym projektem. Wszelkie treści są udostępniane bez gwarancji i bez roszczeń do kompletności lub poprawności.",
        impressumP4:       "Linki do zewnętrznych stron internetowych są podawane wyłącznie dla wygody. Za ich treść odpowiadają wyłącznie ich operatorzy.",

        sample_json: `{
  "nazwa": "Formatomat",
  "wersja": 1,
  "funkcje": ["czytelny", "kompakt", "konwertuj"],
  "aktywny": true
}`,

        sample_yaml: `nazwa: Formatomat
wersja: 1
funkcje:
  - czytelny
  - kompakt
  - konwertuj
aktywny: true`,

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
    'features' => ['czytelny', 'kompakt', 'konwertuj'],
];`,

        sample_ini: `; Ustawienia aplikacji
[app]
name = Formatomat
version = 1
active = true

[features]
list = czytelny, kompakt, konwertuj`,
    },
};
