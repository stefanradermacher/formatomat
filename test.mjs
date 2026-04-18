// Quick sanity test for JSON, YAML, XML, TOML, INI and PHP Array round-trip
import jsonFmt     from "./assets/js/formats/json.js";
import yamlFmt     from "./assets/js/formats/yaml.js";
import xmlFmt      from "./assets/js/formats/xml.js";
import tomlFmt     from "./assets/js/formats/toml.js";
import iniFmt      from "./assets/js/formats/ini.js";
import phparrayFmt from "./assets/js/formats/phparray.js";

let passed = 0, failed = 0;
function check(label, actual, expected) {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    if (ok) { passed++; }
    else {
        failed++;
        console.error(`FAIL ${label}`);
        console.error(`  expected: ${JSON.stringify(expected)}`);
        console.error(`  got:      ${JSON.stringify(actual)}`);
    }
}

// JSON round-trip
const j1 = `{"name":"Test","values":[1,2,3],"nested":{"ok":true}}`;
const jParsed = jsonFmt.parse(j1);
check("json parse name", jParsed.name, "Test");
check("json parse values", jParsed.values, [1, 2, 3]);
check("json parse nested", jParsed.nested.ok, true);

const jPretty = jsonFmt.pretty(jParsed, { indent: 2 });
check("json pretty round-trip", jsonFmt.parse(jPretty), jParsed);

const jMinified = jsonFmt.minify(jParsed);
check("json minify round-trip", jsonFmt.parse(jMinified), jParsed);

// JSON sort keys
const sorted = jsonFmt.pretty({ z: 1, a: 2, m: 3 }, { sortKeys: true, indent: 2 });
check("json sort keys", sorted, '{\n  "a": 2,\n  "m": 3,\n  "z": 1\n}');

// JSON error location
try {
    jsonFmt.parse('{"a": 1,\n"b": broken}');
} catch (e) {
    check("json error has line", typeof e.line, "number");
}

// YAML parse
const y1 = `name: Formatomat
version: 1
features:
  - pretty
  - minify
  - convert
active: true`;
const yParsed = yamlFmt.parse(y1);
check("yaml parse name", yParsed.name, "Formatomat");
check("yaml parse version", yParsed.version, 1);
check("yaml parse features", yParsed.features, ["pretty", "minify", "convert"]);
check("yaml parse active", yParsed.active, true);

// YAML round-trip
const yPretty = yamlFmt.pretty(yParsed);
const yReparsed = yamlFmt.parse(yPretty);
check("yaml round-trip", yReparsed, yParsed);

// Cross format: JSON → object → YAML
const objFromJson = jsonFmt.parse(j1);
const asYaml = yamlFmt.pretty(objFromJson);
const backFromYaml = yamlFmt.parse(asYaml);
check("json→yaml→parse", backFromYaml, objFromJson);

// Detect
check("detect json", jsonFmt.detect(j1), true);
check("detect yaml", yamlFmt.detect(y1), true);
check("json does not detect yaml", jsonFmt.detect(y1), false);
check("yaml does not detect json", yamlFmt.detect(j1), false);

// Flow minify for YAML
const yMin = yamlFmt.minify({ a: 1, b: [1, 2, 3] });
check("yaml flow minify parses back", yamlFmt.parse(yMin), { a: 1, b: [1, 2, 3] });

// Null/boolean handling
const edge = { nada: null, yes: true, no: false, num: 42, str: "hello" };
const edgeYaml = yamlFmt.pretty(edge);
check("yaml edge round-trip", yamlFmt.parse(edgeYaml), edge);

// Empty arrays/objects
const empties = { list: [], map: {}, both: { x: [] } };
check("yaml empty arrays", yamlFmt.parse(yamlFmt.pretty(empties)), empties);

// XML parse
const x1 = `<?xml version="1.0" encoding="UTF-8"?>
<book id="42">
  <title>Hello World</title>
  <published>true</published>
  <pages>128</pages>
</book>`;
const xParsed = xmlFmt.parse(x1);
check("xml parse root key", Object.keys(xParsed).includes("book"), true);
check("xml parse attribute", xParsed.book["@id"], 42);
check("xml parse child text", xParsed.book.title, "Hello World");
check("xml parse numeric child", xParsed.book.pages, 128);

// XML round-trip
const xPretty = xmlFmt.pretty(xParsed, { indent: 2 });
check("xml pretty starts with declaration", xPretty.startsWith("<?xml"), true);
const xReparsed = xmlFmt.parse(xPretty);
check("xml pretty round-trip", xReparsed, xParsed);

const xMin = xmlFmt.minify(xParsed);
check("xml minify has no newlines", xMin.includes("\n"), false);
check("xml minify round-trip", xmlFmt.parse(xMin), xParsed);

// XML detect
check("xml detect", xmlFmt.detect(x1), true);
check("xml does not detect json", xmlFmt.detect(j1), false);
check("xml does not detect yaml", xmlFmt.detect(y1), false);

// XML error handling
try {
    xmlFmt.parse("<root><unclosed></root>");
} catch (e) {
    check("xml error has errors array", Array.isArray(e.errors), true);
}

// TOML parse
const t1 = `name = "Formatomat"\nversion = 1\nactive = true\n\n[features]\nlist = ["pretty", "minify", "convert"]`;
const tParsed = tomlFmt.parse(t1);
check("toml parse name",    tParsed.name,             "Formatomat");
check("toml parse version", tParsed.version,          1);
check("toml parse active",  tParsed.active,           true);
check("toml parse list",    tParsed.features.list,    ["pretty", "minify", "convert"]);

// TOML round-trip
const tPretty = tomlFmt.pretty(tParsed);
check("toml round-trip", tomlFmt.parse(tPretty), tParsed);

// TOML detect
check("toml detect",              tomlFmt.detect(t1), true);
check("toml does not detect json", tomlFmt.detect(j1), false);
check("toml does not detect yaml", tomlFmt.detect(y1), false);
check("toml does not detect xml",  tomlFmt.detect(x1), false);

// TOML error handling
try {
    tomlFmt.parse(`key = @invalid`);
} catch (e) {
    check("toml error has line", typeof e.line, "number");
}

// INI parse
const i1 = `; App config
[app]
name = Formatomat
version = 1
active = true

[features]
list = pretty, minify, convert`;
const iParsed = iniFmt.parse(i1);
check("ini parse section key",   iParsed.app.name,          "Formatomat");
check("ini parse number",        iParsed.app.version,       1);
check("ini parse boolean",       iParsed.app.active,        true);
check("ini parse array",         iParsed.features.list,     ["pretty", "minify", "convert"]);

// INI round-trip
const iPretty = iniFmt.pretty(iParsed);
check("ini round-trip", iniFmt.parse(iPretty), iParsed);

// INI root-level keys
const i2 = `; root
key = value
count = 42`;
const i2Parsed = iniFmt.parse(i2);
check("ini root key",    i2Parsed.key,   "value");
check("ini root number", i2Parsed.count, 42);

// INI detect
check("ini detect",               iniFmt.detect(i1), true);
check("ini does not detect json", iniFmt.detect(j1), false);
check("ini does not detect xml",  iniFmt.detect(x1), false);

// PHP Array parse
const p1 = `<?php
return [
    'name' => 'Formatomat',
    'version' => 1,
    'active' => true,
    'features' => ['pretty', 'minify', 'convert'],
];`;
const p1Parsed = phparrayFmt.parse(p1);
check("phparray parse string",   p1Parsed.name,     "Formatomat");
check("phparray parse number",   p1Parsed.version,  1);
check("phparray parse boolean",  p1Parsed.active,   true);
check("phparray parse array",    p1Parsed.features, ["pretty", "minify", "convert"]);

// PHP Array round-trip (pretty)
const p1Pretty = phparrayFmt.pretty(p1Parsed, { indent: 4 });
check("phparray pretty round-trip", phparrayFmt.parse(p1Pretty), p1Parsed);

// PHP Array minify round-trip
const p1Min = phparrayFmt.minify(p1Parsed);
check("phparray minify round-trip", phparrayFmt.parse(p1Min), p1Parsed);

// PHP Array — long array() syntax
const p2 = `<?php return array('key' => 'val', 'n' => 42);`;
const p2Parsed = phparrayFmt.parse(p2);
check("phparray long syntax key", p2Parsed.key, "val");
check("phparray long syntax num", p2Parsed.n,   42);

// PHP Array — nested + null/false
const p3 = `<?php return ['a' => null, 'b' => false, 'c' => ['x' => 1]];`;
const p3Parsed = phparrayFmt.parse(p3);
check("phparray null",   p3Parsed.a,   null);
check("phparray false",  p3Parsed.b,   false);
check("phparray nested", p3Parsed.c.x, 1);

// PHP Array detect
check("phparray detect",              phparrayFmt.detect(p1), true);
check("phparray does not detect json", phparrayFmt.detect(j1), false);
check("phparray does not detect yaml", phparrayFmt.detect(y1), false);
check("phparray does not detect xml",  phparrayFmt.detect(x1), false);

console.log(`\n${passed}/${passed + failed} passed${failed ? " — " + failed + " FAILED" : " ✓"}`);
if (failed) process.exit(1);
