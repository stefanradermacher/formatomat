export default {
    code: "fr",
    name: "Français",
    htmlLang: "fr-FR",

    ui: {
        tagline:           "L'automate pour tous les formats.",
        inputLabel:        "Entrée",
        outputLabel:       "Sortie",
        inputFormatLabel:  "Entrée",
        outputFormatLabel: "Sortie",
        actionLabel:       "Action",
        indentLabel:       "Indentation",
        indent2:           "2 espaces",
        indent4:           "4 espaces",
        indentTab:         "Tabulation",
        optionsLabel:      "Options",

        actionPretty:      "Lisible",
        actionMinify:      "Compact",

        sortKeys:          "Trier les clés",
        autoDetected:      "détecté automatiquement",
        manual:            "manuel",

        inputPlaceholder:  "Collez ou saisissez vos données ici…",
        outputPlaceholder: "Le résultat formaté apparaîtra ici.",

        empty:             "—",
        byteUnit:          "o",
        lineUnit:          "lignes",

        tooltipPaste:      "Coller depuis le presse-papiers",
        tooltipClearInput: "Effacer l'entrée",
        tooltipCopy:       "Copier dans le presse-papiers",
        tooltipDownload:   "Télécharger",
        tooltipExpand:     "Agrandir",
        tooltipCollapse:   "Réduire",

        copySuccess:       "Copié !",
        copyFailed:        "Échec de la copie",

        errorAt:           "ligne {line}, col {col}",

        jsonErrors: {
            InvalidSymbol:           "Symbole invalide",
            InvalidNumberFormat:     "Format de nombre invalide",
            PropertyNameExpected:    "Nom de propriété attendu",
            ValueExpected:           "Valeur attendue",
            ColonExpected:           "Deux-points attendus",
            CommaExpected:           "Virgule attendue",
            CloseBraceExpected:      "Accolade fermante attendue",
            CloseBracketExpected:    "Crochet fermant attendu",
            EndOfFileExpected:       "Fin de fichier attendue",
            InvalidCommentToken:     "Commentaire invalide",
            UnexpectedEndOfComment:  "Fin de commentaire inattendue",
            UnexpectedEndOfString:   "Fin de chaîne inattendue",
            UnexpectedEndOfNumber:   "Fin de nombre inattendue",
            InvalidUnicode:          "Caractère Unicode invalide",
            InvalidEscapeCharacter:  "Caractère d'échappement invalide",
            InvalidCharacter:        "Caractère invalide",
        },

        footerSupportText: "Formatomat est un projet non commercial et restera gratuit. Pour soutenir son développement, {link}.",
        footerSupportLink: "cliquez ici",

        supportTitle:      "Soutenir Formatomat",
        supportIntro:      "Formatomat est un projet hobby non commercial et reste gratuit pour toi.",
        supportP1:         "Si tu souhaites soutenir le développement et l'hébergement avec un don volontaire, tu peux le faire ici.",
        supportPaypalLabel: "Faire un don via PayPal",

        aboutLink:         "À propos",
        sourceLink:        "Code source",
        impressumLink:     "Mentions légales",
        privacyLink:       "Confidentialité",

        aboutTitle:        "À propos de Formatomat",
        aboutP1:           "Formatomat est un outil rapide et respectueux de la vie privée pour convertir, formater et compacter des données structurées. Tout le traitement s'effectue localement dans votre navigateur — vos données ne quittent jamais votre appareil.",
        aboutP2:           "Formats pris en charge : JSON, YAML, XML, TOML, INI et PHP.",
        aboutP3:           "Open source, licence MIT.",
        aboutDepsLabel:    "Composants open source utilisés :",

        privacyTitle:      "Confidentialité et utilisation des données",
        privacyP1:         "Formatomat ne stocke aucune donnée personnelle sur le serveur.",
        privacyP2:         "Aucun suivi, aucune analyse, aucun cookie tiers n'est utilisé.",
        privacyP3:         "Pour votre confort, quelques préférences (langue, thème) sont conservées dans le stockage local de votre navigateur. Elles ne quittent jamais votre appareil.",
        privacyP4:         "Tout le traitement (analyse, formatage, conversion) s'effectue localement dans votre navigateur. Vos données saisies ne quittent jamais votre appareil.",

        impressumTitle:    "Mentions légales",
        impressumProviderLabel: "Éditeur",
        impressumContactLabel:  "Contact",
        impressumEmailLabel:    "E-mail : ",
        impressumP3:       "Formatomat est un projet privé et non commercial, fourni sans garantie et sans prétention d'exhaustivité.",
        impressumP4:       "Les liens externes sont fournis uniquement à titre pratique. Leur contenu relève de la responsabilité exclusive de leurs opérateurs.",

        sample_json: `{
  "nom": "Formatomat",
  "version": 1,
  "fonctions": ["lisible", "compact", "convertir"],
  "actif": true
}`,

        sample_yaml: `nom: Formatomat
version: 1
fonctions:
  - lisible
  - compact
  - convertir
actif: true`,

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
    'features' => ['lisible', 'compact', 'convertir'],
];`,

        sample_ini: `; Paramètres de l'application
[app]
name = Formatomat
version = 1
active = true

[features]
list = lisible, compact, convertir`,
    },
};
