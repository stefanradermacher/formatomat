export default {
    code: "en",
    name: "English",
    htmlLang: "en",

    ui: {
        tagline:           "The automat for every format.",
        inputLabel:        "Input",
        outputLabel:       "Output",
        inputFormatLabel:  "Input",
        outputFormatLabel: "Output",
        actionLabel:       "Action",
        indentLabel:       "Indent",
        indent2:           "2 Spaces",
        indent4:           "4 Spaces",
        indentTab:         "Tab",
        optionsLabel:      "Options",

        actionPretty:      "Pretty",
        actionMinify:      "Minify",

        sortKeys:          "Sort keys",
        autoDetected:      "auto-detected",
        manual:            "manual",

        inputPlaceholder:  "Paste or type your data here…",
        outputPlaceholder: "Formatted output will appear here.",

        empty:             "—",
        byteUnit:          "B",
        lineUnit:          "lines",

        tooltipPaste:      "Paste from clipboard",
        tooltipClearInput: "Clear input",
        tooltipCopy:       "Copy to clipboard",
        tooltipDownload:   "Download",
        tooltipExpand:     "Expand",
        tooltipCollapse:   "Collapse",

        copySuccess:       "Copied!",
        copyFailed:        "Copy failed",

        errorAt:           "at line {line}, col {col}",

        jsonErrors: {
            InvalidSymbol:           "Invalid symbol",
            InvalidNumberFormat:     "Invalid number format",
            PropertyNameExpected:    "Property name expected",
            ValueExpected:           "Value expected",
            ColonExpected:           "Colon expected",
            CommaExpected:           "Comma expected",
            CloseBraceExpected:      "Closing brace expected",
            CloseBracketExpected:    "Closing bracket expected",
            EndOfFileExpected:       "End of file expected",
            InvalidCommentToken:     "Invalid comment",
            UnexpectedEndOfComment:  "Unexpected end of comment",
            UnexpectedEndOfString:   "Unexpected end of string",
            UnexpectedEndOfNumber:   "Unexpected end of number",
            InvalidUnicode:          "Invalid Unicode character",
            InvalidEscapeCharacter:  "Invalid escape character",
            InvalidCharacter:        "Invalid character",
        },

        footerSupportText: "Formatomat is free and non-commercial. If you want to support development, {link}.",
        footerSupportLink: "click here",

        supportTitle:      "Support Formatomat",
        supportIntro:      "Formatomat is a non-commercial hobby project and remains free for you.",
        supportP1:         "If you'd like to support further development and hosting with a voluntary donation, you can do so here.",
        supportPaypalLabel: "Donate via PayPal",

        aboutLink:         "About",
        sourceLink:        "Source",
        impressumLink:     "Legal Notice",
        privacyLink:       "Privacy",

        aboutTitle:        "About Formatomat",
        aboutP1:           "Formatomat is a fast, privacy-friendly tool for converting, pretty-printing and minifying structured data formats. All processing happens locally in your browser — your data never leaves your device.",
        aboutP2:           "Supported formats: JSON, YAML, XML, TOML, INI and PHP. More formats are planned.",
        aboutP3:           "Open source, MIT-licensed.",
        aboutDepsLabel:    "Open source components used:",

        privacyTitle:      "Privacy & Data Use",
        privacyP1:         "Formatomat does not store any personal data about you on the server.",
        privacyP2:         "All processing (parsing, formatting, converting) happens locally in your browser. Your input data never leaves your device.",
        privacyP3:         "Formatomat does not use tracking, analytics, or third-party cookies.",
        privacyP4:         "For your convenience, a few preferences (such as language and theme) are stored in your browser's local storage. This data never leaves your device and is removed when you clear your browser data.",

        impressumTitle:    "Imprint / Legal Notice",
        impressumProviderLabel: "Service provider",
        impressumContactLabel:  "Contact",
        impressumEmailLabel:    "E-mail: ",
        impressumP3:       "Formatomat is a private, non-commercial project. All content is provided without guarantee and without any claim to completeness or correctness.",
        impressumP4:       "Links to external websites are provided for convenience only. The respective operators are solely responsible for their content.",

        sample_json: `{
  "name": "Formatomat",
  "version": 1,
  "features": ["pretty", "minify", "convert"],
  "active": true
}`,

        sample_yaml: `name: Formatomat
version: 1
features:
  - pretty
  - minify
  - convert
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
    'features' => ['pretty', 'minify', 'convert'],
];`,

        sample_ini: `; Application settings
[app]
name = Formatomat
version = 1
active = true

[features]
list = pretty, minify, convert`,
    },
};
