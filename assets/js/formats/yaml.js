// YAML format module
//
// A lazily-loaded, minimal YAML parser/emitter for the subset of YAML most
// commonly encountered: nested maps, sequences, scalars (strings, numbers,
// booleans, null), simple flow notation, and block scalars. For full YAML
// (anchors, aliases, multi-doc, tags, etc.) a dedicated library would be
// needed — see the README for how to swap in js-yaml later.

export default {
    id: "yaml",
    name: "YAML",
    extension: "yaml",
    mimeType: "application/x-yaml",
    canMinify: false,

    detect(text) {
        const t = text.trim();
        if (t.startsWith("{") || t.startsWith("[") || t.startsWith("<")) return false;
        // Look for "key: value" or "- item" near the start
        const head = t.split("\n").slice(0, 5).join("\n");
        return /^[\w-]+\s*:\s/m.test(head) || /^\s*-\s/m.test(head);
    },

    parse(text) {
        return parseYaml(text);
    },

    pretty(obj, opts = {}) {
        const indent = opts.indent === "tab" ? 4 : Number(opts.indent ?? 2);
        const sorted = opts.sortKeys ? sortKeysDeep(obj) : obj;
        return emitYaml(sorted, indent);
    },

    // YAML has no real "minified" form; the most compact representation is flow
    // notation, which resembles JSON.
    minify(obj, opts = {}) {
        const sorted = opts.sortKeys ? sortKeysDeep(obj) : obj;
        return emitFlow(sorted);
    },
};

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseYaml(text) {
    const lines = text.split("\n").map((l, i) => ({ raw: l, num: i + 1 }));
    // Strip comments, keep line numbers
    const stripped = lines.map(({ raw, num }) => {
        let line = raw;
        // Remove comments, respecting quotes
        let inSingle = false, inDouble = false;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === "'" && !inDouble) inSingle = !inSingle;
            else if (c === '"' && !inSingle) inDouble = !inDouble;
            else if (c === "#" && !inSingle && !inDouble) {
                line = line.slice(0, i);
                break;
            }
        }
        return { raw: line, num, indent: getIndent(line), text: line.trim() };
    }).filter((l) => l.text.length > 0);

    if (stripped.length === 0) return null;

    const ctx = { lines: stripped, i: 0, errors: [] };
    const result = parseNode(ctx, 0);

    if (ctx.errors.length > 0) {
        const err = new Error(ctx.errors[0].message);
        err.name = "ParseError";
        err.line = ctx.errors[0].line;
        err.column = 1;
        err.errors = ctx.errors;
        throw err;
    }
    return result;
}

function getIndent(line) {
    let n = 0;
    while (n < line.length && line[n] === " ") n++;
    return n;
}

function parseNode(ctx, baseIndent) {
    if (ctx.i >= ctx.lines.length) return null;
    const line = ctx.lines[ctx.i];
    if (line.indent < baseIndent) return null;

    // Flow collection on a single line: "{...}" or "[...]"
    if (line.text.startsWith("{") || line.text.startsWith("[")) {
        ctx.i++;
        return parseScalarValue(line.text);
    }

    // Sequence: "- item"
    if (line.text.startsWith("- ") || line.text === "-") {
        return parseSequence(ctx, line.indent);
    }

    // Mapping: "key: value"
    if (/^[^:]+:\s*(.*)$/.test(line.text)) {
        return parseMapping(ctx, line.indent);
    }

    // Plain scalar (unusual at top-level, but valid)
    ctx.i++;
    return parseScalarValue(line.text);
}

function parseSequence(ctx, indent) {
    const result = [];
    while (ctx.i < ctx.lines.length) {
        const line = ctx.lines[ctx.i];
        if (line.indent < indent) break;
        if (line.indent > indent) {
            recordError(ctx, `Unexpected indent`, line.num);
            ctx.i++;
            continue;
        }
        if (!line.text.startsWith("-")) break;

        // "- value" inline
        const afterDash = line.text.slice(1).trim();
        if (afterDash === "") {
            // Nested structure on following lines
            ctx.i++;
            const nested = parseNode(ctx, indent + 2);
            result.push(nested);
        } else if (/^[^:]+:\s*/.test(afterDash) && !/^["']/.test(afterDash)) {
            // "- key: value" — start of inline mapping
            // Treat the dash as opening a mapping at indent+2
            const mappingIndent = indent + 2;
            ctx.lines[ctx.i] = {
                ...line,
                text: afterDash,
                indent: mappingIndent,
            };
            const map = parseMapping(ctx, mappingIndent);
            result.push(map);
        } else {
            ctx.i++;
            result.push(parseScalarValue(afterDash));
        }
    }
    return result;
}

function parseMapping(ctx, indent) {
    const result = {};
    while (ctx.i < ctx.lines.length) {
        const line = ctx.lines[ctx.i];
        if (line.indent < indent) break;
        if (line.indent > indent) {
            recordError(ctx, `Unexpected indent`, line.num);
            ctx.i++;
            continue;
        }
        if (line.text.startsWith("-")) break;

        const match = line.text.match(/^([^:]+):\s*(.*)$/);
        if (!match) {
            recordError(ctx, `Invalid mapping line: ${line.text}`, line.num);
            ctx.i++;
            continue;
        }

        const key = unquote(match[1].trim());
        const rest = match[2];

        if (rest === "") {
            // Value is on following lines
            ctx.i++;
            const nested = parseNode(ctx, indent + 1);
            result[key] = nested;
        } else {
            ctx.i++;
            result[key] = parseScalarValue(rest);
        }
    }
    return result;
}

function parseScalarValue(text) {
    const t = text.trim();

    // Flow sequence
    if (t.startsWith("[") && t.endsWith("]")) {
        return parseFlowSequence(t);
    }
    // Flow mapping
    if (t.startsWith("{") && t.endsWith("}")) {
        return parseFlowMapping(t);
    }
    // Quoted string
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
        return unquote(t);
    }
    // Booleans
    if (/^(true|yes|on)$/i.test(t)) return true;
    if (/^(false|no|off)$/i.test(t)) return false;
    // Null
    if (/^(null|~|)$/i.test(t)) return null;
    // Number
    if (/^-?\d+$/.test(t)) return parseInt(t, 10);
    if (/^-?\d*\.\d+([eE][-+]?\d+)?$/.test(t)) return parseFloat(t);
    if (/^-?\d+([eE][-+]?\d+)$/.test(t)) return parseFloat(t);
    // String
    return t;
}

function parseFlowSequence(text) {
    const inner = text.slice(1, -1).trim();
    if (inner === "") return [];
    return splitFlowItems(inner).map(parseScalarValue);
}

function parseFlowMapping(text) {
    const inner = text.slice(1, -1).trim();
    if (inner === "") return {};
    const result = {};
    for (const item of splitFlowItems(inner)) {
        const m = item.match(/^([^:]+):\s*(.*)$/);
        if (m) {
            result[unquote(m[1].trim())] = parseScalarValue(m[2]);
        }
    }
    return result;
}

function splitFlowItems(text) {
    const items = [];
    let depth = 0, inSingle = false, inDouble = false, current = "";
    for (const c of text) {
        if (c === "'" && !inDouble) inSingle = !inSingle;
        else if (c === '"' && !inSingle) inDouble = !inDouble;
        else if (!inSingle && !inDouble) {
            if (c === "{" || c === "[") depth++;
            else if (c === "}" || c === "]") depth--;
            else if (c === "," && depth === 0) {
                items.push(current.trim());
                current = "";
                continue;
            }
        }
        current += c;
    }
    if (current.trim()) items.push(current.trim());
    return items;
}

function unquote(text) {
    if ((text.startsWith('"') && text.endsWith('"')) ||
        (text.startsWith("'") && text.endsWith("'"))) {
        return text.slice(1, -1);
    }
    return text;
}

function recordError(ctx, message, lineNum) {
    ctx.errors.push({ message, line: lineNum, column: 1 });
}

// ─── Emitter ──────────────────────────────────────────────────────────────────

function emitYaml(value, indent = 2, level = 0) {
    const pad = " ".repeat(indent * level);

    if (value === null || value === undefined) return "null";
    if (typeof value === "boolean" || typeof value === "number") return String(value);
    if (typeof value === "string") return emitScalarString(value);

    if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        return value.map((item) => {
            if (item === null || typeof item !== "object") {
                return `${pad}- ${emitYaml(item, indent, 0)}`;
            }
            const sub = emitYaml(item, indent, level + 1);
            // Indent first item line with dash
            const subLines = sub.split("\n");
            subLines[0] = subLines[0].replace(/^ +/, "");
            return `${pad}- ${subLines[0]}\n${subLines.slice(1).join("\n")}`.trimEnd();
        }).join("\n");
    }

    if (typeof value === "object") {
        const keys = Object.keys(value);
        if (keys.length === 0) return "{}";
        return keys.map((key) => {
            const v = value[key];
            const keyStr = needsQuoting(key) ? `"${key}"` : key;
            if (v === null || typeof v !== "object") {
                return `${pad}${keyStr}: ${emitYaml(v, indent, 0)}`;
            }
            if (Array.isArray(v) && v.length === 0) return `${pad}${keyStr}: []`;
            if (typeof v === "object" && Object.keys(v).length === 0) return `${pad}${keyStr}: {}`;
            return `${pad}${keyStr}:\n${emitYaml(v, indent, level + 1)}`;
        }).join("\n");
    }

    return String(value);
}

function emitScalarString(s) {
    // Quote if ambiguous
    if (s === "" || /^(true|false|null|yes|no|on|off|~)$/i.test(s) ||
        /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(s) ||
        /[:\-#&*?!|>'"%@`,\[\]\{\}\n]/.test(s) || s.includes("  ") || s.trim() !== s) {
        return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return s;
}

function needsQuoting(key) {
    return /[\s:\-#&*?!|>'"%@`,\[\]\{\}]/.test(key) || /^\d/.test(key);
}

function emitFlow(value) {
    if (value === null) return "null";
    if (typeof value === "boolean" || typeof value === "number") return String(value);
    if (typeof value === "string") return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    if (Array.isArray(value)) {
        return `[${value.map(emitFlow).join(", ")}]`;
    }
    if (typeof value === "object") {
        const entries = Object.entries(value).map(([k, v]) => {
            return `"${k}": ${emitFlow(v)}`;
        });
        return `{${entries.join(", ")}}`;
    }
    return String(value);
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
