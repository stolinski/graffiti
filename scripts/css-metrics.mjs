import { readFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

import { generate, parse, tokenize, tokenTypes, walk } from "css-tree";

export const CSS_METRIC_NAMES = [
  "rawBytes",
  "gzipBytes",
  "rules",
  "declarations",
  "classes",
  "customProperties",
];

export const FEATURE_GROUPS = {
  gradients: [
    "gradient-sunset",
    "gradient-ocean",
    "gradient-aurora",
    "gradient-midnight",
    "gradient-dawn",
    "gradient-forest",
    "gradient-lavender",
    "gradient-neon",
    "gradient-slate",
    "gradient-surface",
    "gradient-text",
  ],
  "chat-workbench": [
    "chat-thread",
    "chat-row",
    "chat-message",
    "chat-composer",
    "bubble",
    "icon-rail",
    "layout-rail",
    "log-card",
    "composer",
    "workbench-panel",
  ],
  mobile: [
    "app-shell",
    "bottom-nav",
    "bottom-sheet",
    "safe-top",
    "safe-bottom",
    "safe-x",
    "hide-scrollbar",
    "momentum-scroll",
  ],
};

function parseCss(css, sourceName) {
  try {
    return parse(css, {
      filename: sourceName,
      parseCustomProperty: true,
      positions: true,
    });
  } catch (error) {
    throw new Error(`Failed to parse ${sourceName}`, { cause: error });
  }
}

function stripCssComments(css) {
  let cursor = 0;
  let stripped = "";

  tokenize(css, (type, start, end) => {
    stripped += css.slice(cursor, start);
    stripped += type === tokenTypes.Comment ? " " : css.slice(start, end);
    cursor = end;
  });

  return stripped + css.slice(cursor);
}

export function minifyCss(css, sourceName) {
  return generate(parseCss(stripCssComments(css), sourceName));
}

function createMetricAccumulator() {
  return {
    rawBytes: 0,
    gzipBytes: 0,
    rules: 0,
    declarations: 0,
    classNames: new Set(),
    customPropertyNames: new Set(),
  };
}

function collectNodeMetrics(node, metrics) {
  walk(node, {
    enter(currentNode) {
      if (currentNode.type === "Rule") metrics.rules += 1;
      if (currentNode.type === "ClassSelector") {
        metrics.classNames.add(currentNode.name);
      }
      if (currentNode.type === "Declaration") {
        metrics.declarations += 1;
        if (currentNode.property.startsWith("--")) {
          metrics.customPropertyNames.add(currentNode.property);
        }
      }
      if (
        currentNode.type === "Atrule" &&
        currentNode.name === "property" &&
        currentNode.prelude
      ) {
        metrics.customPropertyNames.add(generate(currentNode.prelude));
      }
    },
  });
}

function finalizeMetrics(metrics) {
  return {
    rawBytes: metrics.rawBytes,
    gzipBytes: metrics.gzipBytes,
    rules: metrics.rules,
    declarations: metrics.declarations,
    classes: metrics.classNames.size,
    customProperties: metrics.customPropertyNames.size,
  };
}

function measureCssFiles(files) {
  const metrics = createMetricAccumulator();

  for (const file of files) {
    const buffer = Buffer.from(file.css);
    metrics.rawBytes += buffer.byteLength;
    metrics.gzipBytes += gzipSync(buffer, { level: 9 }).byteLength;
    collectNodeMetrics(parseCss(file.css, file.fileName), metrics);
  }

  return finalizeMetrics(metrics);
}

function getLocalCssImports(css, sourceName) {
  const imports = [];

  walk(parseCss(css, sourceName), {
    visit: "Atrule",
    enter(node) {
      if (node.name !== "import" || !node.prelude) return;

      walk(node.prelude, {
        enter(importNode) {
          if (
            (importNode.type === "String" || importNode.type === "Url") &&
            typeof importNode.value === "string"
          ) {
            imports.push(importNode.value);
          }
        },
      });
    },
  });

  return imports.filter((value) => value.startsWith("."));
}

async function readCssClosure(packageRoot, target) {
  const files = [];
  const visited = new Set();

  async function visit(filePath) {
    const resolvedPath = path.resolve(filePath);
    if (visited.has(resolvedPath)) return;
    if (!resolvedPath.startsWith(`${packageRoot}${path.sep}`)) {
      throw new Error(
        `CSS import resolves outside the package: ${resolvedPath}`,
      );
    }

    visited.add(resolvedPath);
    const fileName = path
      .relative(packageRoot, resolvedPath)
      .split(path.sep)
      .join("/");
    const css = await readFile(resolvedPath, "utf8");
    files.push({ css, fileName });

    for (const importPath of getLocalCssImports(css, fileName)) {
      await visit(path.resolve(path.dirname(resolvedPath), importPath));
    }
  }

  await visit(path.resolve(packageRoot, target));
  return files;
}

function collectCssTargets(value, targets = new Set()) {
  if (typeof value === "string") {
    if (value.endsWith(".css")) targets.add(value);
    return targets;
  }
  if (!value || typeof value !== "object") return targets;

  for (const nestedValue of Object.values(value)) {
    collectCssTargets(nestedValue, targets);
  }
  return targets;
}

function getCssExportEntries(packageJson) {
  const entries = [];

  for (const [specifier, value] of Object.entries(packageJson.exports ?? {})) {
    const targets = [...collectCssTargets(value)];
    if (targets.length > 1) {
      throw new Error(
        `CSS export ${specifier} resolves to multiple CSS targets: ${targets.join(", ")}`,
      );
    }
    if (targets[0]) entries.push([specifier, targets[0]]);
  }

  return entries;
}

function getClassNames(node) {
  const classNames = new Set();
  if (!node.prelude) return classNames;

  walk(node.prelude, {
    visit: "ClassSelector",
    enter(classNode) {
      classNames.add(classNode.name);
    },
  });
  return classNames;
}

function measureFeatureGroup(ast, rootClasses) {
  const roots = new Set(rootClasses);
  const candidates = [];

  walk(ast, {
    visit: "Rule",
    enter(node) {
      if ([...getClassNames(node)].some((name) => roots.has(name))) {
        candidates.push(node);
      }
    },
  });

  const rules = candidates.filter(
    (candidate) =>
      !candidates.some(
        (other) =>
          other !== candidate &&
          other.loc.start.offset <= candidate.loc.start.offset &&
          other.loc.end.offset >= candidate.loc.end.offset,
      ),
  );
  const serialized = rules.map((rule) => generate(rule)).join("\n");
  const metrics = createMetricAccumulator();
  const buffer = Buffer.from(serialized);
  metrics.rawBytes = buffer.byteLength;
  metrics.gzipBytes = gzipSync(buffer, { level: 9 }).byteLength;
  for (const rule of rules) collectNodeMetrics(rule, metrics);

  return finalizeMetrics(metrics);
}

export async function analyzeCssPackage(packageRoot, packageJson) {
  const entries = {};

  for (const [specifier, target] of getCssExportEntries(packageJson)) {
    const files = await readCssClosure(packageRoot, target);
    entries[specifier] = {
      target,
      files: files.map(({ fileName }) => fileName),
      metrics: measureCssFiles(files),
    };
  }

  const rootTarget = entries["."]?.target;
  if (!rootTarget) {
    throw new Error("The package root must be a public CSS export");
  }
  const rootCss = await readFile(path.resolve(packageRoot, rootTarget), "utf8");
  const rootAst = parseCss(rootCss, rootTarget);
  const featureGroups = Object.fromEntries(
    Object.entries(FEATURE_GROUPS).map(([name, rootClasses]) => [
      name,
      {
        rootClasses,
        metrics: measureFeatureGroup(rootAst, rootClasses),
      },
    ]),
  );

  return { entries, featureGroups };
}

export function createCssBudgetBaseline(report) {
  return {
    schemaVersion: 1,
    policy: {
      mode: "maximum",
      entryPayload:
        "Local @import closures are measured as the sum of their packed CSS files; gzip is level 9 per file.",
      structure:
        "Rules and declarations are CSS Tree AST nodes; classes and custom properties are unique names per entry closure.",
      updates:
        "Intentional public-entry growth requires review followed by pnpm size:update; ordinary checks never rewrite this file.",
      featureGroups:
        "Evidence-only snapshots serialize matching rule subtrees without shared token or at-rule wrapper overhead.",
    },
    entries: Object.fromEntries(
      Object.entries(report.entries).map(([specifier, entry]) => [
        specifier,
        {
          target: entry.target,
          files: entry.files,
          maximum: entry.metrics,
        },
      ]),
    ),
    featureGroups: report.featureGroups,
  };
}

export function getCssBudgetFailures(report, baseline) {
  const failures = [];
  if (baseline.schemaVersion !== 1) {
    return [
      `unsupported css-size-budgets.json schemaVersion: ${String(baseline.schemaVersion)}`,
    ];
  }

  const actualSpecifiers = Object.keys(report.entries);
  const expectedSpecifiers = Object.keys(baseline.entries ?? {});
  const added = actualSpecifiers.filter(
    (specifier) => !expectedSpecifiers.includes(specifier),
  );
  const removed = expectedSpecifiers.filter(
    (specifier) => !actualSpecifiers.includes(specifier),
  );

  if (added.length || removed.length) {
    failures.push(
      `public CSS exports changed (added: ${added.join(", ") || "none"}; removed: ${removed.join(", ") || "none"})`,
    );
  }

  for (const specifier of actualSpecifiers) {
    const actual = report.entries[specifier];
    const expected = baseline.entries?.[specifier];
    if (!expected) continue;

    if (actual.target !== expected.target) {
      failures.push(
        `${specifier} target changed: ${expected.target} -> ${actual.target}`,
      );
    }
    if (!Array.isArray(expected.files)) {
      failures.push(`${specifier} is missing its dependency closure baseline`);
    } else if (
      JSON.stringify(actual.files) !== JSON.stringify(expected.files)
    ) {
      failures.push(
        `${specifier} dependency closure changed: ${expected.files.join(", ")} -> ${actual.files.join(", ")}`,
      );
    }

    for (const metricName of CSS_METRIC_NAMES) {
      const value = actual.metrics[metricName];
      const maximum = expected.maximum?.[metricName];
      if (!Number.isInteger(maximum) || maximum < 0) {
        failures.push(`${specifier} is missing a valid ${metricName} maximum`);
        continue;
      }
      if (value > maximum) {
        failures.push(
          `${specifier} ${metricName}: ${value} (+${value - maximum}; max ${maximum})`,
        );
      }
    }
  }

  return failures;
}

export function assertCssBudgets(report, baseline) {
  const failures = getCssBudgetFailures(report, baseline);
  if (failures.length === 0) return;

  throw new Error(
    [
      "CSS size budgets exceeded:",
      ...failures.map((failure) => `  - ${failure}`),
      "Run `pnpm size:report` to review every entry.",
      "If the growth is intentional, review the deltas and run `pnpm size:update`.",
    ].join("\n"),
  );
}

function formatMetricRow(name, metrics) {
  return [
    name,
    metrics.rawBytes,
    metrics.gzipBytes,
    metrics.rules,
    metrics.declarations,
    metrics.classes,
    metrics.customProperties,
  ].join(" | ");
}

export function formatCssMetricReport(report) {
  const lines = [
    "Entry | Raw bytes | Gzip bytes | Rules | Declarations | Classes | Custom properties",
    "--- | ---: | ---: | ---: | ---: | ---: | ---:",
  ];

  for (const [specifier, entry] of Object.entries(report.entries)) {
    lines.push(formatMetricRow(specifier, entry.metrics));
  }

  lines.push(
    "",
    "Feature group | Raw bytes | Gzip bytes | Rules | Declarations | Classes | Custom properties",
    "--- | ---: | ---: | ---: | ---: | ---: | ---:",
  );
  for (const [name, group] of Object.entries(report.featureGroups)) {
    lines.push(formatMetricRow(name, group.metrics));
  }

  return lines.join("\n");
}
