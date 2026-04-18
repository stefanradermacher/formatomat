// XML format module
// Interface: { id, name, extension, detect, parse, pretty, minify }
//
// Object model conventions:
//   Attributes  → keys prefixed with "@"  (e.g. @id, @class)
//   Text content → "#text" key (only when mixed with child elements)
//   Repeated sibling tags → array
//   XML declaration is not stored in the object graph; it is re-added on output.

import { XMLParser, XMLBuilder, XMLValidator } from "../vendor/fast-xml-parser.js";

const ATTR_PREFIX = "@";
const TEXT_NODE   = "#text";

const PARSER_OPTS = {
    ignoreAttributes:    false,
    attributeNamePrefix: ATTR_PREFIX,
    textNodeName:        TEXT_NODE,
    parseAttributeValue: true,
    parseTagValue:       true,
    trimValues:          true,
    ignoreDeclaration:   true,  // don't store <?xml?> in the object graph
    isArray: (_name, _jpath, _isLeafNode, isAttribute) => false,
};

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
        if (result && typeof result === "object" && Object.keys(result).length === 1 && "root" in result) {
            return result.root;
        }
        return result;
    },

    pretty(obj, opts = {}) {
        const indentStr = opts.indent === "tab" ? "\t" : " ".repeat(Number(opts.indent ?? 2));
        const builder = new XMLBuilder(builderOpts(indentStr));
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(ensureSingleRoot(obj)).trimEnd() + "\n";
    },

    minify(obj) {
        const builder = new XMLBuilder(builderOpts(null));
        return '<?xml version="1.0" encoding="UTF-8"?>' + builder.build(ensureSingleRoot(obj)).trim();
    },
};
