export default {
    code: "es",
    name: "Español",
    htmlLang: "es",

    ui: {
        tagline:           "El autómata para todos los formatos.",
        inputLabel:        "Entrada",
        outputLabel:       "Salida",
        inputFormatLabel:  "Entrada",
        outputFormatLabel: "Salida",
        actionLabel:       "Acción",
        indentLabel:       "Indentación",
        indent2:           "2 espacios",
        indent4:           "4 espacios",
        indentTab:         "Tabulador",
        optionsLabel:      "Opciones",

        actionPretty:      "Legible",
        actionMinify:      "Compacto",

        sortKeys:          "Ordenar claves",
        autoDetected:      "detectado automáticamente",
        manual:            "manual",

        inputPlaceholder:  "Pega o escribe tus datos aquí…",
        outputPlaceholder: "El resultado formateado aparecerá aquí.",

        empty:             "—",
        byteUnit:          "B",
        lineUnit:          "líneas",

        tooltipPaste:      "Pegar desde el portapapeles",
        tooltipClearInput: "Limpiar entrada",
        tooltipCopy:       "Copiar al portapapeles",
        tooltipDownload:   "Descargar",
        tooltipExpand:     "Expandir",
        tooltipCollapse:   "Contraer",

        copySuccess:       "¡Copiado!",
        copyFailed:        "Error al copiar",

        errorAt:           "en línea {line}, col {col}",

        jsonErrors: {
            InvalidSymbol:           "Símbolo no válido",
            InvalidNumberFormat:     "Formato de número no válido",
            PropertyNameExpected:    "Se esperaba un nombre de propiedad",
            ValueExpected:           "Se esperaba un valor",
            ColonExpected:           "Se esperaban dos puntos",
            CommaExpected:           "Se esperaba una coma",
            CloseBraceExpected:      "Se esperaba una llave de cierre",
            CloseBracketExpected:    "Se esperaba un corchete de cierre",
            EndOfFileExpected:       "Se esperaba el fin del archivo",
            InvalidCommentToken:     "Comentario no válido",
            UnexpectedEndOfComment:  "Fin de comentario inesperado",
            UnexpectedEndOfString:   "Fin de cadena inesperado",
            UnexpectedEndOfNumber:   "Fin de número inesperado",
            InvalidUnicode:          "Carácter Unicode no válido",
            InvalidEscapeCharacter:  "Carácter de escape no válido",
            InvalidCharacter:        "Carácter no válido",
        },

        footerSupportText: "Formatomat es un proyecto no comercial y seguirá siendo gratuito. Para apoyar su desarrollo, {link}.",
        footerSupportLink: "haz clic aquí",

        supportTitle:      "Apoyar Formatomat",
        supportIntro:      "Formatomat es un proyecto privado y sin ánimo de lucro, y siempre será gratuito.",
        supportP1:         "Si deseas apoyar el desarrollo o los costes de alojamiento, puedes realizar una pequeña donación.",
        supportPaypalLabel: "Donar con PayPal",

        aboutLink:         "Acerca de",
        sourceLink:        "Código fuente",
        impressumLink:     "Aviso legal",
        privacyLink:       "Privacidad",

        aboutTitle:        "Acerca de Formatomat",
        aboutP1:           "Formatomat es una herramienta rápida y respetuosa con la privacidad para convertir, formatear y compactar datos estructurados. Todo el procesamiento se realiza localmente en tu navegador — tus datos nunca abandonan tu dispositivo.",
        aboutP2:           "Formatos compatibles: JSON, YAML, XML, TOML, INI y PHP.",
        aboutP3:           "Código abierto, licencia MIT.",
        aboutDepsLabel:    "Componentes de código abierto utilizados:",

        privacyTitle:      "Privacidad y uso de datos",
        privacyP1:         "Formatomat no almacena ningún dato personal en el servidor.",
        privacyP2:         "Formatomat no utiliza seguimiento, analíticas ni cookies de terceros.",
        privacyP3:         "Para tu comodidad, algunas preferencias (idioma, tema) se guardan solo en el almacenamiento local de tu navegador. Nunca salen de tu dispositivo.",
        privacyP4:         "Todo el procesamiento (análisis, formateo, conversión) se realiza localmente en tu navegador. Tus datos de entrada nunca abandonan tu dispositivo.",

        impressumTitle:    "Aviso legal",
        impressumProviderLabel: "Responsable",
        impressumContactLabel:  "Contacto",
        impressumEmailLabel:    "E-mail: ",
        impressumP3:       "Formatomat es un proyecto privado y no comercial. Todo el contenido se proporciona sin garantía.",
        impressumP4:       "Los enlaces externos se ofrecen solo por comodidad. Su contenido es responsabilidad exclusiva de sus operadores.",

        sample_json: `{
  "nombre": "Formatomat",
  "versión": 1,
  "funciones": ["legible", "compacto", "convertir"],
  "activo": true
}`,

        sample_yaml: `nombre: Formatomat
versión: 1
funciones:
  - legible
  - compacto
  - convertir
activo: true`,

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
    'features' => ['legible', 'compacto', 'convertir'],
];`,

        sample_ini: `; Configuración de la aplicación
[app]
name = Formatomat
version = 1
active = true

[features]
list = legible, compacto, convertir`,
    },
};
