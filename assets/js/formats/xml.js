// XML format module
// Interface: { id, name, extension, detect, parse, pretty, minify }
//
// Object model conventions:
//   Attributes  → keys prefixed with "@"  (e.g. @id, @class)
//   Text content → "#text" key (only when mixed with child elements)
//   Repeated sibling tags → array
//   XML declaration is kept off the object graph proper (as a non-enumerable
//   symbol property) and re-emitted verbatim on XML output; converting to
//   another format falls back to a default "<?xml version=1.0 UTF-8?>".

import { XMLParser, XMLBuilder, XMLValidator } from "../vendor/fast-xml-parser.js";

const ATTR_PREFIX = "@";
const TEXT_NODE   = "#text";

// Matches the literal <?xml ...?> declaration at the top of a document, kept
// verbatim rather than reconstructed from parsed attributes: running it
// through parseAttributeValue would coerce version="1.0" to the number 1.
const DECLARATION_RE = /^﻿?\s*<\?xml\b[^>]*?\?>/i;

// Non-enumerable so it never leaks into JSON.stringify/Object.keys when
// converting to another format, but survives an XML -> XML round-trip since
// parse() and pretty()/minify() share the same object reference.
const DECLARATION = Symbol("xml-declaration");

const PARSER_OPTS = {
    ignoreAttributes:    false,
    attributeNamePrefix: ATTR_PREFIX,
    textNodeName:        TEXT_NODE,
    parseAttributeValue: true,
    parseTagValue:       true,
    trimValues:          true,
    ignoreDeclaration:   true, // captured separately via DECLARATION_RE instead
    // Preserve leading zeros (e.g. "00123") as strings instead of coercing
    // to a number and silently dropping data.
    numberParseOptions:  { hex: true, leadingZeros: false, eNotation: true },
    isArray: (_name, _jpath, _isLeafNode, isAttribute) => false,
};

function declarationString(obj) {
    const decl = obj && typeof obj === "object" ? obj[DECLARATION] : undefined;
    return decl || '<?xml version="1.0" encoding="UTF-8"?>';
}

// XML requires exactly one root element. If the object has multiple top-level
// keys (e.g. when converting from JSON/YAML), wrap them in <root>.
function ensureSingleRoot(obj) {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        const keys = Object.keys(obj).filter((k) => !k.startsWith("?"));
        if (keys.length === 1) return obj;
        return { root: obj };
    }
    return { root: obj };
}

function builderOpts(indentStr) {
    return {
        ignoreAttributes:    false,
        attributeNamePrefix: ATTR_PREFIX,
        textNodeName:        TEXT_NODE,
        format:              indentStr !== null,
        indentBy:            indentStr ?? "",
        suppressEmptyNode:   false,
    };
}

export default {
    id: "xml",
    name: "XML",
    extension: "xml",
    mimeType: "application/xml",

    detect(text) {
        const t = text.trim();
        // Must start with < but not << (YAML heredoc) or <? (alone) would still match
        return t.startsWith("<") && /^(<\?xml|<[a-zA-Z])/.test(t);
    },

    parse(text) {
        const validation = XMLValidator.validate(text, { allowBooleanAttributes: true });
        if (validation !== true) {
            const err = new Error(validation.err.msg);
            err.name = "ParseError";
            err.line = validation.err.line ?? null;
            err.column = validation.err.col ?? null;
            err.errors = [{ message: validation.err.msg, line: err.line, column: err.column }];
            throw err;
        }
        const parser = new XMLParser(PARSER_OPTS);
        const result = parser.parse(text);
        // Unwrap auto-generated <root> wrapper (added when converting from JSON/YAML)
        const obj = (Object.keys(result).length === 1 && "root" in result) ? result.root : result;
        const match = text.match(DECLARATION_RE);
        if (match && obj && typeof obj === "object") {
            Object.defineProperty(obj, DECLARATION, { value: match[0], enumerable: false });
        }
        return obj;
    },

    pretty(obj, opts = {}) {
        const indentStr = opts.indent === "tab" ? "\t" : " ".repeat(Number(opts.indent ?? 2));
        const builder = new XMLBuilder(builderOpts(indentStr));
        return declarationString(obj) + "\n" + builder.build(ensureSingleRoot(obj)).trimEnd() + "\n";
    },

    minify(obj) {
        const builder = new XMLBuilder(builderOpts(null));
        return declarationString(obj) + builder.build(ensureSingleRoot(obj)).trim();
    },
};
