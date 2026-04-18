// INI format module
// Parses INI-style config files (sections, key=value pairs, ; and # comments).
// Sections become nested objects. Root-level keys (before any section) stay at
// the top level. Values are type-coerced (numbers, booleans). Arrays are
// represented as comma-separated bare values.
// There is no canonical "minified" INI form; minify delegates to pretty.

export default {
    id: "ini",
    name: "INI",
    extension: "ini",
    mimeType: "text/plain",

    detect(text) {
        const t = text.trim();
        if (t.startsWith("{") || t.startsWith("<")) return false;
        // INI-specific signal: semicolon comments (TOML only uses #)
        const hasSemicolon = /^\s*;/m.test(t);
        const hasKeyValue = /^[A-Za-z_]\w*\s*[=:]/m.test(t);
        // Reject TOML-specific syntax: double-bracket sections, typed values
        const hasTomlSpecific = /^\s*\[\[/m.test(t) || /=\s*["'\[{]/.test(t);
        return hasSemicolon && hasKeyValue && !hasTomlSpecific;
    },

    parse(text) {
        const result = {};
        let section = null;
        const lines = text.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const raw = lines[i].trim();
            if (raw === "" || raw.startsWith(";") || raw.startsWith("#")) continue;

            // Section header
            const secMatch = raw.match(/^\[([^\]]+)\]$/);
            if (secMatch) {
                section = secMatch[1].trim();
                if (!(section in result)) result[section] = {};
                continue;
            }

            // Key = value or key: value
            const eqIdx = raw.indexOf("=");
            const colonIdx = raw.indexOf(":");
            let sepIdx = -1;
            if (eqIdx !== -1 && (colonIdx === -1 || eqIdx <= colonIdx)) sepIdx = eqIdx;
            else if (colonIdx !== -1) sepIdx = colonIdx;
            if (sepIdx === -1) continue;

            const key = raw.slice(0, sepIdx).trim();
            const rawVal = raw.slice(sepIdx + 1).trim();
            const val = coerceValue(rawVal);

            if (section === null) {
                result[key] = val;
            } else {
                result[section][key] = val;
            }
        }
        return result;
    },

    pretty(obj, opts = {}) {
        const sorted = opts.sortKeys ? sortKeysDeep(obj) : obj;
        return emitIni(sorted);
    },

    minify(obj, opts = {}) {
        return this.pretty(obj, opts);
    },
};

function coerceValue(raw) {
    if ((raw.startsWith('"') && raw.endsWith('"')) ||
        (raw.startsWith("'") && raw.endsWith("'"))) {
        return raw.slice(1, -1);
    }
    const lo = raw.toLowerCase();
    if (lo === "true"  || lo === "yes" || lo === "on")  return true;
    if (lo === "false" || lo === "no"  || lo === "off") return false;
    if (raw !== "" && !isNaN(Number(raw))) return Number(raw);
    // Comma-separated list → array
    if (raw.includes(",")) return raw.split(",").map((s) => coerceValue(s.trim()));
    return raw;
}

function emitValue(val) {
    if (typeof val === "boolean") return val ? "true" : "false";
    if (typeof val === "number")  return String(val);
    if (Array.isArray(val))       return val.map(emitValue).join(", ");
    return String(val);
}

function emitIni(obj) {
    const rootLines = [];
    const sections  = [];

    for (const [key, val] of Object.entries(obj)) {
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
            const lines = [`[${key}]`];
            for (const [k, v] of Object.entries(val)) {
                lines.push(`${k} = ${emitValue(v)}`);
            }
            sections.push(lines.join("\n"));
        } else {
            rootLines.push(`${key} = ${emitValue(val)}`);
        }
    }

    const parts = [];
    if (rootLines.length > 0) parts.push(rootLines.join("\n"));
    parts.push(...sections);
    return parts.join("\n\n");
}

function sortKeysDeep(value) {
    if (Array.isArray(value)) return value.map(sortKeysDeep);
    if (value && typeof value === "object") {
        const sorted = {};
        Object.keys(value).sort().forEach((k) => { sorted[k] = sortKeysDeep(value[k]); });
        return sorted;
    }
    return value;
}