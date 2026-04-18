export default {
    code: "nl",
    name: "Nederlands",
    htmlLang: "nl-NL",

    ui: {
        tagline:           "De automaat voor alle formaten.",
        inputLabel:        "Invoer",
        outputLabel:       "Uitvoer",
        inputFormatLabel:  "Invoer",
        outputFormatLabel: "Uitvoer",
        actionLabel:       "Actie",
        indentLabel:       "Inspringing",
        indent2:           "2 spaties",
        indent4:           "4 spaties",
        indentTab:         "Tab",
        optionsLabel:      "Opties",

        actionPretty:      "Leesbaar",
        actionMinify:      "Compact",

        sortKeys:          "Sleutels sorteren",
        autoDetected:      "automatisch gedetecteerd",
        manual:            "handmatig",

        inputPlaceholder:  "Plak of typ hier uw gegevens…",
        outputPlaceholder: "Het geformatteerde resultaat verschijnt hier.",

        empty:             "—",
        byteUnit:          "B",
        lineUnit:          "regels",

        tooltipPaste:      "Plakken uit klembord",
        tooltipClearInput: "Invoer wissen",
        tooltipCopy:       "Kopiëren naar klembord",
        tooltipDownload:   "Downloaden",
        tooltipExpand:     "Uitklappen",
        tooltipCollapse:   "Inklappen",

        copySuccess:       "Gekopieerd!",
        copyFailed:        "Kopiëren mislukt",

        errorAt:           "regel {line}, kol {col}",

        jsonErrors: {
            InvalidSymbol:           "Ongeldig symbool",
            InvalidNumberFormat:     "Ongeldig getalformaat",
            PropertyNameExpected:    "Eigenschapsnaam verwacht",
            ValueExpected:           "Waarde verwacht",
            ColonExpected:           "Dubbele punt verwacht",
            CommaExpected:           "Komma verwacht",
            CloseBraceExpected:      "Sluitende accolade verwacht",
            CloseBracketExpected:    "Sluitend haakje verwacht",
            EndOfFileExpected:       "Einde van bestand verwacht",
            InvalidCommentToken:     "Ongeldig commentaar",
            UnexpectedEndOfComment:  "Onverwacht einde van commentaar",
            UnexpectedEndOfString:   "Onverwacht einde van tekenreeks",
            UnexpectedEndOfNumber:   "Onverwacht einde van getal",
            InvalidUnicode:          "Ongeldig Unicode-teken",
            InvalidEscapeCharacter:  "Ongeldig escape-teken",
            InvalidCharacter:        "Ongeldig teken",
        },

        footerSupportText: "Formatomat is gratis en niet-commercieel. Als je de ontwikkeling wilt steunen, {link}.",
        footerSupportLink: "klik hier",

        supportTitle:      "Formatomat steunen",
        supportIntro:      "Formatomat is een niet-commercieel project en blijft altijd gratis.",
        supportP1:         "Als u de ontwikkeling en hostingkosten wilt steunen, kunt u een kleine donatie doen.",
        supportPaypalLabel: "Doneren via PayPal",

        aboutLink:         "Over",
        sourceLink:        "Broncode",
        impressumLink:     "Juridische informatie",
        privacyLink:       "Privacy",

        aboutTitle:        "Over Formatomat",
        aboutP1:           "Formatomat is een snel en privacyvriendelijk hulpmiddel voor het converteren, opmaken en comprimeren van gestructureerde gegevens. Alle verwerking vindt lokaal in uw browser plaats — uw gegevens verlaten uw apparaat nooit.",
        aboutP2:           "Ondersteunde formaten: JSON, YAML, XML, TOML, INI en PHP.",
        aboutP3:           "Open source, MIT-licentie.",
        aboutDepsLabel:    "Gebruikte open source componenten:",

        privacyTitle:      "Privacy & Gegevensgebruik",
        privacyP1:         "Formatomat slaat geen persoonlijke gegevens op de server op.",
        privacyP2:         "Formatomat gebruikt geen tracking, analyses of cookies van derden.",
        privacyP3:         "Voor uw gemak worden enkele voorkeuren (taal, thema) opgeslagen in de lokale opslag van uw browser. Deze gegevens verlaten uw apparaat nooit.",
        privacyP4:         "Alle verwerking (parseren, opmaken, converteren) vindt lokaal in uw browser plaats. Uw invoergegevens verlaten uw apparaat nooit.",

        impressumTitle:    "Impressum / Juridische informatie",
        impressumProviderLabel: "Dienstverlener",
        impressumContactLabel:  "Contact",
        impressumEmailLabel:    "E-mail: ",
        impressumP3:       "Formatomat is een privé, niet-commercieel project. Alle inhoud wordt zonder garantie en zonder aanspraak op volledigheid of juistheid verstrekt.",
        impressumP4:       "Links naar externe websites worden uitsluitend voor het gemak verstrekt. De betreffende exploitanten zijn als enige verantwoordelijk voor hun inhoud.",

        sample_json: `{
  "naam": "Formatomat",
  "versie": 1,
  "functies": ["leesbaar", "compact", "converteren"],
  "actief": true
}`,

        sample_yaml: `naam: Formatomat
versie: 1
functies:
  - leesbaar
  - compact
  - converteren
actief: true`,

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
    'features' => ['leesbaar', 'compact', 'converteren'],
];`,

        sample_ini: `; Applicatie-instellingen
[app]
name = Formatomat
version = 1
active = true

[features]
list = leesbaar, compact, converteren`,
    },
};
