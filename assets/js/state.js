// Shared application state.

export const state = {
    inputFormat:  "json",
    outputFormat: "json",
    action:       "pretty",      // "pretty" | "minify"
    indent:       "2",           // "2" | "4" | "tab"
    sortKeys:     false,
    autoDetected: false,         // was inputFormat auto-detected from input?
    lastParsed:   null,          // last successful parse result (object graph)
    lastInputSize: 0,
    lastOutputSize: 0,
    currentLocale: null,
};
