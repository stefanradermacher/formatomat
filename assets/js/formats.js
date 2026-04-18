// Format registry — lazy-loads format modules on demand.

const registry = {
    json: { id: "json", name: "JSON", canMinify: true,  module: null },
    yaml: { id: "yaml", name: "YAML", canMinify: false, module: null },
    xml:  { id: "xml",  name: "XML",  canMinify: true,  module: null },
    toml: { id: "toml", name: "TOML", canMinify: false, module: null },
    ini:      { id: "ini",      name: "INI",       canMinify: false, module: null },
    phparray: { id: "phparray", name: "PHP",        canMinify: true,  module: null },
};

export const FORMAT_IDS = Object.keys(registry);
export const FORMATS = registry; // keyed by id
export const FORMAT_LIST = Object.values(registry).map(({ id, name }) => ({ id, name }));

export async function getFormat(id) {
    const entry = registry[id];
    if (!entry) throw new Error(`Unknown format: ${id}`);
    if (!entry.module) {
        const mod = await import(`./formats/${id}.js`);
        entry.module = mod.default;
    }
    return entry.module;
}

// Auto-detect format by consulting each format's detect() — first match wins.
// Callers typically respect user's explicit choice first; detect is a fallback.
export async function detectFormat(text) {
    if (!text || !text.trim()) return null;
    for (const id of FORMAT_IDS) {
        const fmt = await getFormat(id);
        if (fmt.detect(text)) return id;
    }
    return null;
}
