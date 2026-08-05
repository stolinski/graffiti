import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import {
  access,
  cp,
  mkdtemp,
  mkdir,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

import {
  analyzeCssPackage,
  assertCssBudgets,
  minifyCss,
} from "./css-metrics.mjs";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const excludedDirectories = new Set([
  ".git",
  ".svelte-kit",
  ".screenshots",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
]);
const rawCssExports = new Map([
  ["./raw", "."],
  ["./themes/editorial/raw", "./themes/editorial"],
  ["./themes/paper/raw", "./themes/paper"],
  ["./themes/system/raw", "./themes/system"],
  ["./themes/neon-arcade/raw", "./themes/neon-arcade"],
  ["./themes/soft-consumer/raw", "./themes/soft-consumer"],
  ["./themes/studio/raw", "./themes/studio"],
  ["./themes/signal/raw", "./themes/signal"],
  ["./themes/lumen/raw", "./themes/lumen"],
  ["./themes/schematic/raw", "./themes/schematic"],
]);
const minifiedCssExports = new Map([
  ["./min", "./dist/index.css"],
  ["./drop-in.min.css", "./dist/drop-in.css"],
]);
const obsoletePackedFiles = [
  "build.js",
  "decks-raw.js",
  "index.html",
  "package-lock.json",
  "raw.js",
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      [
        `${command} ${args.join(" ")} exited with status ${result.status}`,
        result.stdout.trim(),
        result.stderr.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  return result.stdout.trim();
}

function exportSpecifier(packageName, exportName) {
  return exportName === "."
    ? packageName
    : `${packageName}${exportName.slice(1)}`;
}

async function copyCleanSource(destination) {
  await cp(packageRoot, destination, {
    recursive: true,
    filter(source) {
      const relativePath = path.relative(packageRoot, source);
      if (!relativePath) return true;
      return !relativePath
        .split(path.sep)
        .some((segment) => excludedDirectories.has(segment));
    },
  });

  await access(path.join(packageRoot, "node_modules"));
  await symlink(
    path.join(packageRoot, "node_modules"),
    path.join(destination, "node_modules"),
    process.platform === "win32" ? "junction" : "dir",
  );
}

const temporaryRoot = await mkdtemp(
  path.join(os.tmpdir(), "graffiti-package-"),
);

try {
  const sourceFixture = path.join(temporaryRoot, "source");
  const consumerFixture = path.join(temporaryRoot, "consumer");
  const tarballDirectory = path.join(temporaryRoot, "tarball");

  await copyCleanSource(sourceFixture);
  await mkdir(consumerFixture, { recursive: true });
  await mkdir(tarballDirectory, { recursive: true });

  const packOutput = run(
    npmCommand,
    ["pack", "--json", "--silent", "--pack-destination", tarballDirectory],
    { cwd: sourceFixture },
  );
  const jsonStart = packOutput.lastIndexOf("\n[");
  const [packResult] = JSON.parse(
    jsonStart === -1 ? packOutput : packOutput.slice(jsonStart + 1),
  );
  assert(packResult, "npm pack did not return package metadata");

  const tarballPath = path.join(
    tarballDirectory,
    path.basename(packResult.filename),
  );
  await access(tarballPath);

  await writeFile(
    path.join(consumerFixture, "package.json"),
    `${JSON.stringify({ private: true, type: "module" }, null, 2)}\n`,
  );
  run(
    npmCommand,
    [
      "install",
      "--ignore-scripts",
      "--no-package-lock",
      "--no-save",
      "--loglevel=error",
      tarballPath,
    ],
    { cwd: consumerFixture },
  );

  const installedRoot = path.join(
    consumerFixture,
    "node_modules",
    "@drop-in",
    "graffiti",
  );
  const installedPackage = JSON.parse(
    await readFile(path.join(installedRoot, "package.json"), "utf8"),
  );
  const requireFromConsumer = createRequire(
    path.join(consumerFixture, "verify.cjs"),
  );
  const exportCounts = { css: 0, json: 0, js: 0 };

  for (const [exportName, target] of Object.entries(installedPackage.exports)) {
    assert.equal(
      typeof target,
      "string",
      `${exportName} must have a string target`,
    );

    const specifier = exportSpecifier(installedPackage.name, exportName);
    const resolvedPath = requireFromConsumer.resolve(specifier);
    assert.equal(
      resolvedPath,
      await realpath(path.resolve(installedRoot, target)),
    );

    if (target.endsWith(".css")) {
      assert(
        (await readFile(resolvedPath, "utf8")).trim(),
        `${specifier} is empty`,
      );
      exportCounts.css += 1;
      continue;
    }

    if (target.endsWith(".json")) {
      const registry = JSON.parse(await readFile(resolvedPath, "utf8"));
      assert(
        Array.isArray(registry.patterns),
        `${specifier} is not a Graffiti registry`,
      );
      exportCounts.json += 1;
      continue;
    }

    const module = await import(pathToFileURL(resolvedPath).href);
    if (exportName === "./svelte") {
      assert.equal(typeof module.swipe_event, "function");
      assert.equal(typeof module.scroll_on_load, "function");
    } else {
      assert.equal(
        typeof module.default,
        "string",
        `${specifier} has no CSS string export`,
      );
      assert(
        module.default.trim(),
        `${specifier} has an empty CSS string export`,
      );
      const cssExportName = rawCssExports.get(exportName);
      if (cssExportName) {
        const cssTarget = installedPackage.exports[cssExportName];
        assert.equal(
          module.default,
          await readFile(path.resolve(installedRoot, cssTarget), "utf8"),
          `${specifier} does not match ${exportSpecifier(installedPackage.name, cssExportName)}`,
        );
      }
    }
    exportCounts.js += 1;
  }

  for (const [exportName, readableTarget] of minifiedCssExports) {
    const minifiedTarget = installedPackage.exports[exportName];
    const readableCss = await readFile(
      path.resolve(installedRoot, readableTarget),
      "utf8",
    );
    const minifiedCss = await readFile(
      path.resolve(installedRoot, minifiedTarget),
      "utf8",
    );
    assert.equal(
      minifiedCss,
      minifyCss(readableCss, readableTarget),
      `${exportSpecifier(installedPackage.name, exportName)} is not the deterministic minification of ${readableTarget}`,
    );
    assert(!minifiedCss.includes("/*"), `${minifiedTarget} contains comments`);
  }

  const sizeBaseline = JSON.parse(
    await readFile(path.join(packageRoot, "css-size-budgets.json"), "utf8"),
  );
  const sizeReport = await analyzeCssPackage(installedRoot, installedPackage);
  assertCssBudgets(sizeReport, sizeBaseline);

  await access(path.resolve(installedRoot, installedPackage.main));

  const binDirectory = path.join(consumerFixture, "node_modules", ".bin");
  const binPath = (name) =>
    path.join(
      binDirectory,
      process.platform === "win32" ? `${name}.cmd` : name,
    );
  const binOptions = {
    cwd: consumerFixture,
    shell: process.platform === "win32",
  };

  const graffitiOutput = run(binPath("graffiti"), [], binOptions);
  const copiedCssPath = path.join(consumerFixture, "src", "drop-in.css");
  assert.equal(
    await readFile(copiedCssPath, "utf8"),
    await readFile(path.join(installedRoot, "dist", "drop-in.css"), "utf8"),
  );

  const lookupOutput = run(
    binPath("graffiti-lookup"),
    ["card", "--json"],
    binOptions,
  );
  const lookupResult = JSON.parse(lookupOutput);
  assert.equal(lookupResult.kind, "pattern");
  assert.equal(lookupResult.entry.name, "card");

  const packedFiles = packResult.files
    .map(({ path: filePath }) => filePath)
    .sort();
  for (const obsoleteFile of obsoletePackedFiles) {
    assert(
      !packedFiles.includes(obsoleteFile),
      `Packed tarball contains obsolete root file: ${obsoleteFile}`,
    );
  }
  console.log(
    `Verified ${Object.keys(installedPackage.exports).length} exports ` +
      `(${exportCounts.css} CSS, ${exportCounts.json} JSON, ${exportCounts.js} JS).`,
  );
  console.log(
    `CSS budgets verified for ${Object.keys(sizeReport.entries).length} public entries from the clean tarball.`,
  );
  console.log(`graffiti: ${graffitiOutput}`);
  console.log("graffiti-lookup: resolved .card [pattern]");
  console.log(`Packed ${packedFiles.length} files:\n${packedFiles.join("\n")}`);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
