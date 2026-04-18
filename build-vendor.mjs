// One-time build script: bundles vendor libraries into single ESM files.
// Run with: node build-vendor.mjs
// Outputs: assets/js/vendor/codemirror.bundle.js
//          assets/js/vendor/fast-xml-parser.js
//          assets/js/vendor/smol-toml.js

import { build } from "esbuild";
import { mkdir } from "fs/promises";

await mkdir("assets/js/vendor", { recursive: true });

await build({
    stdin: {
        contents: `
export { EditorState, Compartment } from "@codemirror/state";
export { EditorView, ViewPlugin, Decoration, lineNumbers, highlightActiveLine,
         highlightActiveLineGutter, drawSelection,
         dropCursor, rectangularSelection, crosshairCursor,
         keymap } from "@codemirror/view";
export { defaultKeymap, history, historyKeymap,
         indentWithTab } from "@codemirror/commands";
export { syntaxHighlighting, defaultHighlightStyle,
         HighlightStyle, indentOnInput,
         bracketMatching, syntaxTree } from "@codemirror/language";
export { json } from "@codemirror/lang-json";
export { yaml } from "@codemirror/lang-yaml";
export { xml } from "@codemirror/lang-xml";
export { php } from "@codemirror/lang-php";
export { tags } from "@lezer/highlight";
`,
        resolveDir: ".",
        loader: "js",
    },
    bundle: true,
    format: "esm",
    outfile: "assets/js/vendor/codemirror.bundle.js",
    minify: false,
    treeShaking: true,
    logLevel: "info",
});

console.log("Done → assets/js/vendor/codemirror.bundle.js");

await build({
    stdin: {
        contents: `export { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";`,
        resolveDir: ".",
        loader: "js",
    },
    bundle: true,
    format: "esm",
    outfile: "assets/js/vendor/fast-xml-parser.js",
    minify: false,
    treeShaking: true,
    logLevel: "info",
});

console.log("Done → assets/js/vendor/fast-xml-parser.js");

await build({
    stdin: {
        contents: `export { parse, stringify } from "smol-toml";`,
        resolveDir: ".",
        loader: "js",
    },
    bundle: true,
    format: "esm",
    outfile: "assets/js/vendor/smol-toml.js",
    minify: false,
    treeShaking: true,
    logLevel: "info",
});

console.log("Done → assets/js/vendor/smol-toml.js");
