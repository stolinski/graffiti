import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { expect } from "vitest";

const DIST_DIR = path.resolve(process.cwd(), "dist");

export const DIST_FILES = {
  index: "index.css",
  core: "core.css",
  utilities: "utilities.css",
  layouts: "layouts.css",
  components: "components.css",
  minimal: "minimal.css",
  standard: "standard.css",
  decks: "decks.css",
} as const;

export const resolveDistFile = (fileName: string) =>
  path.join(DIST_DIR, fileName);

export async function readDistCss(fileName: string): Promise<string> {
  const filePath = resolveDistFile(fileName);

  await expect(access(filePath)).resolves.toBeUndefined();

  return readFile(filePath, "utf8");
}
