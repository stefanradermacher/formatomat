// PHP Array format module
// Parses PHP array literals (<?php return [...];) into JS values and back.
// Supports short [] and long array() syntax, single/double-quoted strings,
// integers, floats, true/false/null, nested arrays, and // # /* */ comments.

export default {
    id: "phparray",
    name: "PHP",
    extension: "php",
    mimeType: "application/x-php",

    detect(text) {
        const t = text.trim();
        return t.startsWith("<?php") &&
            (t.includes("=>") || t.includes("[") || /\barray\s*\(/.test(t));
    },

    parse(text) {
        try {
            return phpParse(text);
        } catch (e) {
            const err = new Error(e.message);
            err.name = "ParseError";
            err.line = e.line ?? null;
            err.errors = [{ message: e.message, line: err.line }];
            throw err;
        }
    },

    pretty(obj, opts = {}) {
        const sorted = opts.sortKeys ? sortKeysDeep(obj) : obj;
        const step = opts.indent === "tab" ? "\t" : " ".repeat(Number(opts.indent ?? 4));
        return "<?php\nreturn " + emitPhp(sorted, step, 0) + ";\n";
    },

    minify(obj, opts = {}) {
        const sorted = opts.sortKeys ? sortKeysDeep(obj) : obj;
        return "<?php return " + emitPhpMin(sorted) + ";";
    },
};

// ─── Parser ───────────────────────────────────────────────────────────────────

function phpParse(text) {
    let src = text.trim();
    if (src.startsWith("<?php")) src = src.slice(5);

    const p = new Parser(src);
    p.skipWs();

    if (src.startsWith("return", p.pos)) {
        p.pos += 6;
        p.skipWs();
    }

    const val = p.parseValue();

    p.skipWs();
    if (!p.done && p.ch === ";") p.pos++;

    return val;
}

class Parser {
    constructor(src) {
        this.src = src;
        this.pos = 0;
    }

    get done() { return this.pos >= this.src.length; }
    get ch()   { return this.src[this.pos]; }

    skipWs() {
        while (!this.done) {
            const c = this.ch;
            if (c === " " || c === "\t" || c === "\n" || c === "\r") {
                this.pos++;
            } else if (c === "/" && this.src[this.pos + 1] === "/") {
                while (!this.done && this.ch !== "\n") this.pos++;
            } else if (c === "#") {
                while (!this.done && this.ch !== "\n") this.pos++;
            } else if (c === "/" && this.src[this.pos + 1] === "*") {
                this.pos += 2;
                while (!this.done && !(this.ch === "*" && this.src[this.pos + 1] === "/")) this.pos++;
                if (!this.done) this.pos += 2;
            } else {
                break;
            }
        }
    }

    parseValue() {
        this.skipWs();
        if (this.done) throw new Error("Unexpected end of input");
        const c = this.ch;

        if (c === "[") return this.parseShortArray();
        if (this.src.startsWith("array", this.pos) && /[\s(]/.test(this.src[this.pos + 5] ?? "")) {
            return this.parseLongArray();
        }
        if (c === "'" || c === '"') return this.parseString(c);
        if (c === "-" || (c >= "0" && c <= "9")) return this.parseNumber();

        for (const [kw, val] of [["true", true], ["false", false], ["null", null],
                                  ["TRUE", true], ["FALSE", false], ["NULL", null]]) {
            if (this.src.startsWith(kw, this.pos) &&
                !/\w/.test(this.src[this.pos + kw.length] ?? "")) {
                this.pos += kw.length;
                return val;
            }
        }

        throw new Error(`Unexpected character '${c}' at position ${this.pos}`);
    }

    parseShortArray() {
        this.pos++; // [
        return this.parseArrayContents("]");
    }

    parseLongArray() {
        this.pos += 5; // array
        this.skipWs();
        if (this.ch !== "(") throw new Error("Expected '(' after array");
        this.pos++; // (
        return this.parseArrayContents(")");
    }

    parseArrayContents(closing) {
        const items = [];
        let autoKey = 0;

        this.skipWs();
        while (!this.done && this.ch !== closing) {
            const savedPos = this.pos;
            let key = null;
            let value;

            const candidate = this.parseValue();
            this.skipWs();

            if (!this.done && this.src.startsWith("=>", this.pos)) {
                key = candidate;
                this.pos += 2;
                this.skipWs();
                value = this.parseValue();
                if (typeof key === "number") autoKey = key + 1;
            } else {
                value = candidate;
                key = autoKey++;
            }

            items.push({ key, value });

            this.skipWs();
            if (!this.done && this.ch === ",") {
                this.pos++;
                this.skipWs();
            }
        }

        if (this.done && closing !== "") throw new Error(`Expected '${closing}'`);
        this.pos++; // skip closing bracket

        // Sequential 0-based integer keys → plain JS array
        const isSeq = items.length > 0 && items.every((item, i) => item.key === i);
        if (isSeq) return items.map((item) => item.value);

        const obj = {};
        for (const { key, value } of items) obj[String(key)] = value;
        return obj;
    }

    parseString(quote) {
        this.pos++; // opening quote
        let result = "";

        if (quote === "'") {
            while (!this.done && this.ch !== "'") {
                if (this.ch === "\\" && (this.src[this.pos + 1] === "'" || this.src[this.pos + 1] === "\\")) {
                    result += this.src[this.pos + 1];
                    this.pos += 2;
                } else {
                    result += this.ch;
                    this.pos++;
                }
            }
        } else {
            const esc = { n: "\n", t: "\t", r: "\r", '"': '"', "\\": "\\", "$": "$", "0": "\0", "e": "\x1b" };
            while (!this.done && this.ch !== '"') {
                if (this.ch === "\\") {
                    this.pos++;
                    result += esc[this.ch] ?? this.ch;
                    this.pos++;
                } else {
                    result += this.ch;
                    this.pos++;
                }
            }
        }

        if (this.done) throw new Error("Unterminated string literal");
        this.pos++; // closing quote
        return result;
    }

    parseNumber() {
        let s = "";
        if (this.ch === "-") { s += "-"; this.pos++; }
        while (!this.done && this.ch >= "0" && this.ch <= "9") { s += this.ch; this.pos++; }
        if (!this.done && this.ch === ".") {
            s += ".";
            this.pos++;
            while (!this.done && this.ch >= "0" && this.ch <= "9") { s += this.ch; this.pos++; }
        }
        return Number(s);
    }
}

// ─── Emitter ──────────────────────────────────────────────────────────────────

function emitPhp(val, step, depth) {
    if (val === null)           return "null";
    if (typeof val === "boolean") return val ? "true" : "false";
    if (typeof val === "number")  return String(val);
    if (typeof val === "string")  return phpQuote(val);

    const pad      = step.repeat(depth + 1);
    const closePad = step.repeat(depth);

    if (Array.isArray(val)) {
        if (val.length === 0) return "[]";
        const lines = val.map((v) => `${pad}${emitPhp(v, step, depth + 1)}`);
        return `[\n${lines.join(",\n")},\n${closePad}]`;
    }

    const keys = Object.keys(val);
    if (keys.length === 0) return "[]";
    const lines = keys.map((k) => `${pad}${phpQuote(k)} => ${emitPhp(val[k], step, depth + 1)}`);
    return `[\n${lines.join(",\n")},\n${closePad}]`;
}

function emitPhpMin(val) {
    if (val === null)             return "null";
    if (typeof val === "boolean") return val ? "true" : "false";
    if (typeof val === "number")  return String(val);
    if (typeof val === "string")  return phpQuote(val);
    if (Array.isArray(val))       return "[" + val.map(emitPhpMin).join(",") + "]";
    const keys = Object.keys(val);
    return "[" + keys.map((k) => `${phpQuote(k)}=>${emitPhpMin(val[k])}`).join(",") + "]";
}

function phpQuote(str) {
    return "'" + String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
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
