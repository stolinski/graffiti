/**
 * derive-mirror.mjs
 *
 * Single source of truth for derived color scales (ADR-0006). Reads
 * src/lib/drop-in.css, concatenates every /* derive:source *\/ block in
 * source order, and writes the result between the /* derive:mirror *\/
 * markers inside :where([class*="theme-"]). Re-runs are idempotent.
 *
 * Wired into `pnpm build` so the mirror cannot drift from the canonical
 * :root derivations.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cssPath = path.join(__dirname, "..", "src/lib/drop-in.css");
const isCheck = process.argv.slice(2).includes("--check");

const SOURCE_RE = /\/\* derive:source \*\/\n([\s\S]*?)[ \t]*\/\* \/derive:source \*\//g;
const MIRROR_RE = /(\/\* derive:mirror \*\/\n)[\s\S]*?([ \t]*\/\* \/derive:mirror \*\/)/;

const css = await fs.readFile(cssPath, "utf8");

const sources = [];
for (const match of css.matchAll(SOURCE_RE)) {
  sources.push(match[1].replace(/\s+$/, ""));
}
if (sources.length === 0) {
  console[isCheck ? "error" : "warn"](
    "derive-mirror: no derive:source blocks found, leaving file untouched",
  );
  process.exit(isCheck ? 1 : 0);
}
if (!MIRROR_RE.test(css)) {
  console.error("derive-mirror: derive:source blocks found but no derive:mirror region");
  process.exit(1);
}

const body = `${sources.join("\n\n")}\n`;
const updated = css.replace(MIRROR_RE, (_, open, close) => `${open}${body}${close}`);

if (updated === css) {
  console.log(`derive-mirror: ${sources.length} sources, mirror already in sync`);
} else if (isCheck) {
  console.error(
    `derive-mirror: mirror is out of sync with ${sources.length} sources. Run \`pnpm build\` to regenerate it.`,
  );
  process.exit(1);
} else {
  await fs.writeFile(cssPath, updated);
  console.log(`derive-mirror: regenerated mirror from ${sources.length} sources`);
}
