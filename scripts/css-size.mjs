import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { format } from "prettier";

import {
  analyzeCssPackage,
  assertCssBudgets,
  createCssBudgetBaseline,
  formatCssMetricReport,
} from "./css-metrics.mjs";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const budgetPath = path.join(packageRoot, "css-size-budgets.json");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

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

async function assertPackedCssMatchesGenerated(report, installedRoot) {
  const files = new Set(
    Object.values(report.entries).flatMap((entry) => entry.files),
  );

  for (const fileName of files) {
    const [generated, packed] = await Promise.all([
      readFile(path.join(packageRoot, fileName)),
      readFile(path.join(installedRoot, fileName)),
    ]);
    assert.deepEqual(
      packed,
      generated,
      `Packed ${fileName} differs from the generated package content`,
    );
  }
}

async function createPackedReport() {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "graffiti-size-"));

  try {
    const tarballDirectory = path.join(temporaryRoot, "tarball");
    const consumerDirectory = path.join(temporaryRoot, "consumer");
    await mkdir(tarballDirectory, { recursive: true });
    await mkdir(consumerDirectory, { recursive: true });
    await writeFile(
      path.join(consumerDirectory, "package.json"),
      `${JSON.stringify({ private: true }, null, 2)}\n`,
    );

    const packOutput = run(
      npmCommand,
      [
        "pack",
        "--json",
        "--silent",
        "--ignore-scripts",
        "--pack-destination",
        tarballDirectory,
      ],
      { cwd: packageRoot },
    );
    const [packResult] = JSON.parse(packOutput);
    if (!packResult)
      throw new Error("npm pack did not return package metadata");

    const tarballPath = path.join(tarballDirectory, packResult.filename);
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
      { cwd: consumerDirectory },
    );

    const installedRoot = path.join(
      consumerDirectory,
      "node_modules",
      "@drop-in",
      "graffiti",
    );
    const packageJson = JSON.parse(
      await readFile(path.join(installedRoot, "package.json"), "utf8"),
    );
    const report = await analyzeCssPackage(installedRoot, packageJson);
    await assertPackedCssMatchesGenerated(report, installedRoot);

    return { packResult, report };
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

async function main() {
  const mode = process.argv[2] ?? "--check";
  if (!["--check", "--report", "--update"].includes(mode)) {
    throw new TypeError(`Unknown CSS size mode: ${mode}`);
  }

  const { packResult, report } = await createPackedReport();
  console.log(`CSS metrics from packed artifact ${packResult.filename}:`);
  console.log(formatCssMetricReport(report));

  if (mode === "--update") {
    const baseline = createCssBudgetBaseline(report);
    await writeFile(
      budgetPath,
      await format(JSON.stringify(baseline), { parser: "json" }),
    );
    console.log(`Updated ${path.relative(packageRoot, budgetPath)}.`);
    return;
  }
  if (mode === "--report") return;

  const baseline = JSON.parse(await readFile(budgetPath, "utf8"));
  assertCssBudgets(report, baseline);
  console.log(
    `CSS budgets verified for ${Object.keys(report.entries).length} public entries.`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
