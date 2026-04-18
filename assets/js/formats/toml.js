// TOML format module
// Interface: { id, name, extension, detect, parse, pretty, minify }
//
// Uses smol-toml (MIT) for parsing and serialization.
// TOML has no concept of "minify" — the output is always human-readable.
// Minify is therefore an alias for pretty (sortKeys still applies).

import { parse as tomlParse, stringify as tomlStringify } from "../vendor/smol-toml.js";

export default {
    id: "toml",
    name: "TOML",
    extension: "toml",
    mimeType: "application/toml",

    detect(text) {
        const t = text.trim();
        // TOML files typically start with a comment, a [section], or a key = value pair
        return /^(\s*#|\s*\[|[a-zA-Z_"'])/.test(t) && t.includes("=") && !t.startsWith("{") && !t.startsWith("<");
    },

    parse(text) {
        try {
            return tomlParse(text);
        } catch (e) {
            const err = new Error(e.message);
            err.name = "ParseError";
            err.line   = e.line   ?? null;
            err.column = e.column ?? null;
            err.errors = [{ message: e.message, line: err.line, column: err.column }];
            throw err;
        }
    },

    pretty(obj, opts = {}) {
        const sorted = opts.sortKeys ? sortKeysDeep(obj) : obj;
        return tomlStringify(sorted);
    },

    // TOML has no compact/minified form — delegate to pretty
    minify(obj, opts = {}) {
        return this.pretty(obj, opts);
    },
};

function sortKeysDeep(value) {
    if (Array.isArray(value)) return value.map(sortKeysDeep);
    if (value && typeof value === "object") {
        const sorted = {};
        Object.keys(value).sort().forEach((k) => { sorted[k] = sortKeysDeep(value[k]); });
        return sorted;
    }
    return value;
}
