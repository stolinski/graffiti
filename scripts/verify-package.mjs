import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const packageJson = JSON.parse(
  await readFile(path.join(packageRoot, "package.json"), "utf8"),
);
const changesetConfig = JSON.parse(
  await readFile(path.join(packageRoot, ".changeset", "config.json"), "utf8"),
);
const license = await readFile(path.join(packageRoot, "LICENSE"), "utf8");

if (packageJson.license !== "MIT" || !license.startsWith("MIT License\n")) {
  throw new Error("package.json and LICENSE must both declare the MIT license");
}
if (changesetConfig.access !== packageJson.publishConfig?.access) {
  throw new Error("Changesets access must match publishConfig.access");
}
if (!/^pnpm@\d+\.\d+\.\d+$/.test(packageJson.packageManager ?? "")) {
  throw new Error("packageManager must pin an exact pnpm version");
}

await access(path.join(packageRoot, "pnpm-lock.yaml"));
for (const obsoleteLockfile of [
  "package-lock.json",
  ".opencode/package-lock.json",
]) {
  try {
    await access(path.join(packageRoot, obsoleteLockfile));
    throw new Error(
      `${obsoleteLockfile} must not exist; pnpm-lock.yaml is canonical`,
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("must not exist")) {
      throw error;
    }
    if (
      !error ||
      typeof error !== "object" ||
      !("code" in error) ||
      error.code !== "ENOENT"
    ) {
      throw error;
    }
  }
}

function collectTargets(value) {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  return Object.values(value).flatMap(collectTargets);
}

const advertisedTargets = [
  ["main", packageJson.main],
  ...Object.entries(packageJson.bin ?? {}).map(([name, target]) => [
    `bin.${name}`,
    target,
  ]),
  ...Object.entries(packageJson.exports ?? {}).flatMap(([name, value]) =>
    collectTargets(value).map((target) => [
      `exports[${JSON.stringify(name)}]`,
      target,
    ]),
  ),
];

for (const [label, target] of advertisedTargets) {
  if (typeof target !== "string" || !target) {
    throw new TypeError(`${label} must point to a package file`);
  }

  const targetPath = path.resolve(packageRoot, target);
  if (!targetPath.startsWith(`${packageRoot}${path.sep}`)) {
    throw new Error(`${label} points outside the package: ${target}`);
  }

  try {
    await access(targetPath);
  } catch {
    throw new Error(`${label} points to a missing file: ${target}`);
  }
}

for (const [name, target] of Object.entries(packageJson.bin ?? {})) {
  const contents = await readFile(path.resolve(packageRoot, target), "utf8");
  if (!contents.startsWith("#!/usr/bin/env node")) {
    throw new Error(`bin.${name} is missing a Node shebang: ${target}`);
  }
}

console.log(`Verified ${advertisedTargets.length} package entry targets.`);
