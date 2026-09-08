#!/usr/bin/env node
// Baut aus src/ das Store-Paket (dist/store + dist/formatomat-extension-store.zip).
// Keine npm-Abhängigkeiten. Benötigt lediglich das `zip`-CLI (macOS/Linux).
//
// Die Store-Variante wird aus der EINEN Quelle abgeleitet:
//   - host_permissions/matches auf formatomat.net beschränken (localhost raus)
//   - options_ui entfernen, Options-Dateien weglassen
//   - ungenutzte opt_*-Übersetzungen entfernen
//   - Quell-SVG des Icons weglassen
// Name, Version, Beschreibung usw. bleiben allein in src/manifest.json.

import { promises as fs } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import url from "node:url";

const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
const dist = path.join(root, "dist");
const out = path.join(dist, "store");
const zipPath = path.join(dist, "formatomat-extension-store.zip");
const PROD_HOST = "https://formatomat.net/*";
const KEEP_MSG = new Set(["app_name", "app_desc", "send_to_formatomat"]);
const DEV_ONLY = ["options.html", "options.js", path.join("icons", "favicon.svg")];

const rmrf = (p) => fs.rm(p, { recursive: true, force: true });

async function main() {
  await rmrf(out);
  await fs.mkdir(out, { recursive: true });
  await fs.cp(src, out, { recursive: true });

  // Dev-only-Dateien entfernen
  for (const f of DEV_ONLY) await rmrf(path.join(out, f));

  // Manifest ableiten
  const mfPath = path.join(out, "manifest.json");
  const mf = JSON.parse(await fs.readFile(mfPath, "utf8"));
  mf.host_permissions = [PROD_HOST];
  for (const cs of mf.content_scripts ?? []) {
    if (Array.isArray(cs.matches)) {
      cs.matches = cs.matches.filter((m) => m.includes("formatomat.net"));
    }
  }
  delete mf.options_ui;
  await fs.writeFile(mfPath, JSON.stringify(mf, null, 2) + "\n");

  // Locales auf genutzte Schlüssel reduzieren
  const locDir = path.join(out, "_locales");
  for (const loc of await fs.readdir(locDir)) {
    const p = path.join(locDir, loc, "messages.json");
    const msgs = JSON.parse(await fs.readFile(p, "utf8"));
    const trimmed = Object.fromEntries(
      Object.entries(msgs).filter(([k]) => KEEP_MSG.has(k))
    );
    await fs.writeFile(p, JSON.stringify(trimmed, null, 2) + "\n");
  }

  // Zippen – manifest.json MUSS auf der Root-Ebene des Zips liegen (Web-Store-Pflicht)
  await rmrf(zipPath);
  execSync(`cd "${out}" && zip -r "${zipPath}" . -x '.DS_Store' '*/.DS_Store'`, {
    stdio: "inherit"
  });

  console.log(`\n✓ Store-Paket: ${path.relative(root, zipPath)}  (Version ${mf.version})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
