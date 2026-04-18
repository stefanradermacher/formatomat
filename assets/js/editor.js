// CodeMirror editor module — wraps CM6 for input and output panels.

import {
    EditorState, Compartment,
    EditorView, ViewPlugin, Decoration,
    lineNumbers, highlightActiveLine, highlightActiveLineGutter,
    drawSelection, keymap,
    defaultKeymap, history, historyKeymap, indentWithTab,
    syntaxHighlighting, HighlightStyle, indentOnInput, bracketMatching,
    syntaxTree,
    json, yaml, xml, php,
    tags,
} from "./vendor/codemirror.bundle.js";

// ─── Syntax token → CSS-variable mapping ─────────────────────────────────────
// We define one HighlightStyle that references CSS custom properties so all
// five Formatomat themes are covered without duplicating token rules.

const formatomat = syntaxHighlighting(HighlightStyle.define([
    // JSON / generic
    { tag: tags.string,                color: "var(--cm-string)" },
    { tag: tags.number,                color: "var(--cm-number)" },
    { tag: tags.bool,                  color: "var(--cm-keyword)" },
    { tag: tags.null,                  color: "var(--cm-keyword)" },
    { tag: tags.propertyName,          color: "var(--cm-property)" },
    { tag: tags.keyword,               color: "var(--cm-keyword)" },
    { tag: tags.comment,               color: "var(--cm-comment)", fontStyle: "italic" },
    { tag: tags.punctuation,           color: "var(--cm-punctuation)" },
    { tag: tags.definitionKeyword,     color: "var(--cm-keyword)" },
    { tag: tags.typeName,              color: "var(--cm-property)" },
    { tag: tags.operator,              color: "var(--cm-punctuation)" },
    // XML
    { tag: tags.angleBracket,          color: "var(--cm-punctuation)" },
    { tag: tags.tagName,               color: "var(--cm-keyword)" },
    { tag: tags.attributeName,         color: "var(--cm-property)" },
    { tag: tags.attributeValue,        color: "var(--cm-string)" },
    { tag: tags.processingInstruction, color: "var(--cm-comment)", fontStyle: "italic" },
]));

// ─── YAML scalar decoration plugin ───────────────────────────────────────────
// lezer-yaml tags all plain scalars as `tags.content` without distinguishing
// booleans, numbers, or null. This ViewPlugin walks the syntax tree and applies
// CSS mark decorations based on the scalar's text content.

const YAML_BOOL_RE   = /^(true|false|yes|no|on|off)$/i;
const YAML_NUMBER_RE = /^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
const YAML_NULL_RE   = /^(null|~)$/i;

const boolMark   = Decoration.mark({ class: "cm-yaml-bool" });
const numberMark = Decoration.mark({ class: "cm-yaml-number" });
const nullMark   = Decoration.mark({ class: "cm-yaml-null" });

function buildYamlDecorations(view) {
    const ranges = [];
    const { from, to } = view.viewport;
    syntaxTree(view.state).iterate({
        from, to,
        enter(node) {
            if (node.name !== "Literal") return;
            // Skip keys — their parent is a "Key" node
            if (node.node.parent?.name === "Key") return;
            const text = view.state.doc.sliceString(node.from, node.to);
            if (YAML_BOOL_RE.test(text))        ranges.push(boolMark.range(node.from, node.to));
            else if (YAML_NULL_RE.test(text))   ranges.push(nullMark.range(node.from, node.to));
            else if (YAML_NUMBER_RE.test(text)) ranges.push(numberMark.range(node.from, node.to));
        },
    });
    return Decoration.set(ranges);
}

const yamlValuePlugin = ViewPlugin.fromClass(
    class {
        constructor(view) { this.decorations = buildYamlDecorations(view); }
        update(update) {
            if (update.docChanged || update.viewportChanged)
                this.decorations = buildYamlDecorations(update.view);
        }
    },
    { decorations: (v) => v.decorations }
);

// ─── Theme overrides (layout / chrome) ───────────────────────────────────────

const baseTheme = EditorView.baseTheme({
    "&": {
        height: "100%",
        fontSize: "13px",
        fontFamily: "var(--font-mono)",
    },
    ".cm-scroller": {
        overflow: "auto",
        lineHeight: "1.6",
        fontFamily: "var(--font-mono)",
    },
    ".cm-content": {
        padding: "14px 12px",
        caretColor: "var(--fg)",
    },
    ".cm-gutters": {
        backgroundColor: "var(--bg-panel)",
        color: "var(--fg-muted)",
        border: "none",
        borderRight: "1px solid var(--border)",
        minWidth: "2.5em",
    },
    ".cm-lineNumbers .cm-gutterElement": {
        padding: "0 8px 0 10px",
        minWidth: "2em",
        textAlign: "right",
    },
    ".cm-activeLineGutter": {
        backgroundColor: "var(--bg-raised)",
        color: "var(--fg-dim)",
    },
    ".cm-activeLine": {
        backgroundColor: "var(--bg-raised)",
    },
    ".cm-cursor": {
        borderLeftColor: "var(--fg)",
    },
    ".cm-selectionBackground, ::selection": {
        backgroundColor: "var(--accent-dim) !important",
        opacity: "0.4",
    },
    ".cm-focused .cm-selectionBackground": {
        backgroundColor: "var(--accent-dim)",
    },
    "&.cm-focused": {
        outline: "none",
    },
});

// ─── Compartments (hot-swappable config) ─────────────────────────────────────

const languageCompartment = new Compartment();
const editableCompartment = new Compartment();

const LANG_MAP = {
    json:     json(),
    yaml:     yaml(),
    xml:      xml(),
    phparray: php(),
};

// ─── Factory helpers ──────────────────────────────────────────────────────────

function commonExtensions(editable, langId, onChange) {
    const lang = LANG_MAP[langId] ?? json();
    const exts = [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        indentOnInput(),
        bracketMatching(),
        drawSelection(),
        history(),
        languageCompartment.of(lang),
        editableCompartment.of(EditorView.editable.of(editable)),
        EditorState.readOnly.of(!editable),
        formatomat,
        yamlValuePlugin,
        baseTheme,
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
    ];
    if (onChange) {
        exts.push(EditorView.updateListener.of((update) => {
            if (update.docChanged) onChange(update.state.doc.toString());
        }));
    }
    if (!editable) {
        exts.push(EditorView.editable.of(false));
    }
    return exts;
}

export function createInputEditor(parent, langId, onChange) {
    return new EditorView({
        state: EditorState.create({
            doc: "",
            extensions: commonExtensions(true, langId, onChange),
        }),
        parent,
    });
}

export function createOutputEditor(parent, langId) {
    return new EditorView({
        state: EditorState.create({
            doc: "",
            extensions: [...commonExtensions(false, langId, null), EditorView.lineWrapping],
        }),
        parent,
    });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getText(view) {
    return view.state.doc.toString();
}

export function setText(view, text) {
    view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: text },
    });
}

export function setLanguage(view, langId) {
    const lang = LANG_MAP[langId] ?? json();
    view.dispatch({ effects: languageCompartment.reconfigure(lang) });
}

export function focusAndMoveTo(view, offset) {
    view.focus();
    view.dispatch({ selection: { anchor: offset, head: offset } });
    view.dispatch({ scrollIntoView: true });
}
