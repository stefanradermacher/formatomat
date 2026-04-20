// JSON format module
// Interface: { id, name, extension, detect, parse, pretty, minify }

import { parse as jsoncParse, printParseErrorCode } from "../vendor/jsonc-parser.js";

export default {
    id: "json",
    name: "JSON",
    extension: "json",
    mimeType: "application/json",

    // Heuristic: starts with { or [
    detect(text) {
        const t = text.trim();
        return t.startsWith("{") || t.startsWith("[");
    },

    // Parse text into a JS object graph using fault-tolerant jsonc-parser.
    // Collects all errors; throws a multi-error object when any are found.
    parse(text) {
        const errors = [];
        const result = jsoncParse(text, errors, { disallowComments: true });
        if (errors.length > 0) {
            const parseErrors = errors.map((e) => {
                const { line, column } = offsetToLineColumn(text, e.offset);
                const code = printParseErrorCode(e.error);
                return {
                    code,
                    message: humanizeErrorCode(code),
                    offset: e.offset,
                    length: e.length,
                    line,
                    column,
                };
            });
            const err = new Error(parseErrors[0].message);
            err.name = "ParseError";
            err.line = parseErrors[0].line;
            err.column = parseErrors[0].column;
            err.errors = parseErrors;
            throw err;
        }
        // If the result is a string that is itself valid JSON (double-encoded),
        // parse it one more level so pasting an escaped JSON string value works.
        if (typeof result === "string") {
            const inner = [];
            const decoded = jsoncParse(result, inner, { disallowComments: true });
            if (inner.length === 0 && decoded !== null && typeof decoded === "object") {
                return decoded;
            }
        }
        return result;
    },

    // Turn object graph into pretty-printed JSON string
    pretty(obj, opts = {}) {
        const indent = opts.indent === "tab" ? "\t" : Number(opts.indent ?? 2);
        const sorted = opts.sortKeys ? sortKeysDeep(obj) : obj;
        return JSON.stringify(sorted, null, indent);
    },

    // Turn object graph into minified JSON string
    minify(obj, opts = {}) {
        const sorted = opts.sortKeys ? sortKeysDeep(obj) : obj;
        return JSON.stringify(sorted);
    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortKeysDeep(value) {
    if (Array.isArray(value)) return value.map(sortKeysDeep);
    if (value && typeof value === "object") {
        const sorted = {};
        Object.keys(value).sort().forEach((k) => { sorted[k] = sortKeysDeep(value[k]); });
        return sorted;
    }
    return value;
}

function humanizeErrorCode(code) {
    return code.replace(/([A-Z])/g, " $1").trim().toLowerCase().replace(/^./, (c) => c.toUpperCase());
}

function offsetToLineColumn(text, offset) {
    let line = 1, column = 1;
    for (let i = 0; i < offset && i < text.length; i++) {
        if (text[i] === "\n") { line++; column = 1; } else { column++; }
    }
    return { line, column };
}
