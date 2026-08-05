/**
 * graffiti-lint
 *
 * Validates primary class and root-token annotations, classifies every custom
 * property declared or consumed by `src/lib/drop-in.css`, checks that private
 * tokens do not leak into consumer docs, and emits Registry v2.
 *
 * Spec: docs/ANNOTATION-SPEC.md
 *
 * Exports:
 *   - lintCss(source, opts?) -> { violations, registry }   (pure)
 *   - runLint({ check, file }) -> exit code                (CLI side)
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cssTree from "css-tree";

import { agentSections, templatePages } from "../src/docs/agent/manifest.js";
import { parseMarkdownDocument } from "../src/docs/content/frontmatter.js";

const TOKEN_CATEGORIES = new Set([
  "typography",
  "spacing",
  "radius",
  "color",
  "shadow",
  "motion",
  "border",
  "layout",
  "z-index",
  "misc",
]);

const TOKEN_TIERS = new Set([
  "primitive-reference",
  "global-semantic",
  "component-contract",
  "private-calculated",
]);

const TOKEN_VISIBILITIES = new Set(["public", "private"]);
const TOKEN_DEFAULT_STABILITIES = new Set(["stable", "fallback", "calculated"]);
const LIFECYCLE_STATUSES = new Set(["active", "deprecated"]);

const PRIVATE_TOKEN_PREFIX = "--_component-";

const LOGICAL_PSEUDO_CLASSES = new Set(["is", "where"]);
const STATE_ATTRIBUTES = new Set(["disabled", "hidden", "open"]);

const FEATURE_DETECTORS = [
  ["oklch", (text) => /oklch\(/i.test(text)],
  ["light-dark", (text) => /light-dark\(/i.test(text)],
  ["relative-color", (text) => /oklch\(\s*from\s/i.test(text)],
  ["color-mix", (text) => /color-mix\(/i.test(text)],
  ["linear-easing", (text) => /linear\(/i.test(text)],
  [
    "popover",
    (text) =>
      /\[popover(?:target(?:action)?|[\]=])|:popover-open|popover="/i.test(
        text,
      ),
  ],
  [
    "anchor-positioning",
    (text) =>
      /\b(?:anchor-name|anchor-scope|position-anchor|position-area|position-try)\s*:|anchor\(/i.test(
        text,
      ),
  ],
  ["forced-colors", (text) => /forced-colors\s*:\s*active/i.test(text)],
  ["accent-color", (text) => /\baccent-color\s*:/i.test(text)],
];

const REQUIRED_TAGS = {
  pattern: ["pattern", "role", "example"],
  "pattern-group": ["pattern-group", "members", "role", "example"],
  token: ["token", "category", "role"],
  "token-group": ["token-group", "matches", "category", "role"],
  "token-set": [
    "token-set",
    "matches",
    "tier",
    "visibility",
    "default",
    "role",
  ],
};

/* ------------------------------------------------------------------ *
 * Comment parsing
 * ------------------------------------------------------------------ */

/**
 * Parse a JSDoc-style comment body into tag entries. The body is the raw
 * value between `/*` and `*​/` (no slashes), with a leading `*` if it was
 * `/**` style.
 *
 * Returns { kind, tags } where kind is one of pattern|pattern-group|
 * token|token-group|token-set|null. Tags is a Map<string, string> with multi-line
 * values joined.
 *
 * Tags can be repeated only if explicitly multi-line (currently none —
 * a repeated tag is a violation).
 */
export function parseAnnotation(value) {
  // Strip leading "*" lines and surrounding whitespace
  const lines = value.split("\n").map((line) => {
    return line.replace(/^\s*\*\s?/, "").replace(/\s+$/, "");
  });

  // First non-empty line that starts with @ is the kind tag
  const tags = new Map();
  let currentTag = null;
  let currentBuf = [];
  const duplicates = [];

  const flush = () => {
    if (currentTag === null) return;
    const joined = currentBuf.join("\n").replace(/^\n+|\n+$/g, "");
    if (tags.has(currentTag)) duplicates.push(currentTag);
    else tags.set(currentTag, joined);
    currentTag = null;
    currentBuf = [];
  };

  for (const line of lines) {
    const m = line.match(/^@([a-z-]+)(?:\s+(.*))?$/);
    if (m) {
      flush();
      currentTag = m[1];
      currentBuf = m[2] ? [m[2]] : [];
    } else if (currentTag !== null) {
      currentBuf.push(line);
    }
  }
  flush();

  let kind = null;
  if (tags.has("pattern")) kind = "pattern";
  else if (tags.has("pattern-group")) kind = "pattern-group";
  else if (tags.has("token")) kind = "token";
  else if (tags.has("token-group")) kind = "token-group";
  else if (tags.has("token-set")) kind = "token-set";

  return { kind, tags, duplicates };
}

/* ------------------------------------------------------------------ *
 * AST classification
 * ------------------------------------------------------------------ */

/**
 * Classify a Rule node's selector. Returns:
 *   { kind: "primary-class", name }    — selector is exactly `.foo`
 *   { kind: "compound" }               — `.foo.bar`, `.foo:hover`, descendants, etc.
 *   { kind: "root" }                   — selector is exactly `:root`
 *   { kind: "other" }                  — anything else
 *
 * For a SelectorList with multiple Selectors, the rule is classified by the
 * MOST permissive entry — any non-primary-class entry kicks it to "other".
 */
function classifyRule(rule) {
  const selectors = rule.prelude?.children?.toArray() ?? [];
  if (selectors.length === 0) return { kind: "other" };

  const bareClasses = [];
  for (const selector of selectors) {
    const parts = selector.children?.toArray() ?? [];
    if (parts.length !== 1) continue;
    const part = parts[0];
    if (part.type === "ClassSelector") bareClasses.push(part.name);
    if (
      selectors.length === 1 &&
      part.type === "PseudoClassSelector" &&
      part.name === "root"
    ) {
      return { kind: "root" };
    }
  }

  if (bareClasses.length === 1) {
    return { kind: "primary-class", name: bareClasses[0] };
  }

  return { kind: "compound" };
}

function normalizeSelector(selector) {
  try {
    return cssTree.generate(cssTree.parse(selector, { context: "selector" }));
  } catch {
    return selector.trim().replace(/\s+/g, " ");
  }
}

function listSelectors(prelude) {
  if (!prelude) return [];

  if (prelude.type === "SelectorList") {
    return prelude.children
      .toArray()
      .map((selector) => normalizeSelector(cssTree.generate(selector)));
  }

  const rendered = cssTree.generate(prelude);
  try {
    const selectorList = cssTree.parse(rendered, { context: "selectorList" });
    return selectorList.children
      .toArray()
      .map((selector) => normalizeSelector(cssTree.generate(selector)));
  } catch {
    return [normalizeSelector(rendered)];
  }
}

function resolveNestedSelectors(selectors, parentSelectors) {
  if (!parentSelectors?.length) return selectors.map(normalizeSelector);

  const resolved = parentSelectors.flatMap((parentSelector) => {
    const parent = normalizeSelector(parentSelector);
    return selectors.map((authoredSelector) => {
      const selector = normalizeSelector(authoredSelector);
      if (selector.includes("&")) {
        return normalizeSelector(selector.split("&").join(parent));
      }
      if (/^(?:[>+~]|\|\|)/.test(selector)) {
        return normalizeSelector(`${parent}${selector}`);
      }
      return normalizeSelector(`${parent} ${selector}`);
    });
  });

  return [...new Set(resolved)];
}

function inspectSelector(selector) {
  const classNames = new Set();
  const elements = new Set();
  let ast;

  try {
    ast = cssTree.parse(normalizeSelector(selector), { context: "selector" });
  } catch {
    return {
      classNames,
      classOccurrences: [],
      compounds: [],
      elementOccurrences: [],
      elements,
      states: [],
    };
  }

  const compounds = [];
  let nodes = [];
  let combinatorBefore = null;
  for (const node of ast.children?.toArray() ?? []) {
    if (node.type === "Combinator") {
      if (nodes.length > 0) {
        compounds.push({ nodes, combinatorBefore });
        nodes = [];
      }
      combinatorBefore = node.name;
      continue;
    }
    nodes.push(node);
  }
  if (nodes.length > 0) compounds.push({ nodes, combinatorBefore });

  const classOccurrences = [];
  const elementOccurrences = [];
  const states = [];
  const inspectNode = (node, compoundIndex, relation = "direct") => {
    if (node.type === "ClassSelector") {
      classNames.add(node.name);
      classOccurrences.push({
        name: node.name,
        compoundIndex,
        relation,
      });
      return;
    }
    if (node.type === "TypeSelector" && node.name !== "*") {
      elements.add(node.name);
      elementOccurrences.push({
        name: node.name,
        compoundIndex,
        relation,
      });
      return;
    }
    if (node.type === "AttributeSelector") {
      const attributeName = node.name?.name ?? "";
      if (
        STATE_ATTRIBUTES.has(attributeName) ||
        attributeName.startsWith("aria-") ||
        attributeName.startsWith("data-")
      ) {
        states.push({
          compoundIndex,
          kind: "attribute",
          selector: cssTree.generate(node),
        });
      }
      return;
    }
    if (node.type !== "PseudoClassSelector") return;

    if (LOGICAL_PSEUDO_CLASSES.has(node.name)) {
      cssTree.walk(node, {
        enter(child) {
          if (
            child === node ||
            child.type === "SelectorList" ||
            child.type === "Selector"
          ) {
            return;
          }
          if (child.type === "PseudoClassSelector" && child.name === "not") {
            states.push({
              compoundIndex,
              kind: "selector-condition",
              selector: cssTree.generate(child),
            });
            return cssTree.walk.skip;
          }
          if (child.type === "PseudoClassSelector" && child.name === "has") {
            states.push({
              compoundIndex,
              kind: "selector-condition",
              selector: cssTree.generate(child),
            });
            return cssTree.walk.skip;
          }
          if (child.type === "ClassSelector") {
            inspectNode(child, compoundIndex, "logical");
            return;
          }
          if (
            child.type === "TypeSelector" ||
            child.type === "AttributeSelector"
          ) {
            inspectNode(child, compoundIndex, "logical");
            return;
          }
          if (
            child.type === "PseudoClassSelector" &&
            !LOGICAL_PSEUDO_CLASSES.has(child.name)
          ) {
            states.push({
              compoundIndex,
              kind: "pseudo-class",
              selector: `:${child.name}`,
            });
          }
        },
      });
      return;
    }

    if (node.name === "not" || node.name === "has") {
      states.push({
        compoundIndex,
        kind: "selector-condition",
        selector: cssTree.generate(node),
      });
      if (node.name === "has") {
        cssTree.walk(node, {
          visit: "ClassSelector",
          enter(child) {
            inspectNode(child, compoundIndex, "relative");
          },
        });
      }
      return;
    }

    states.push({
      compoundIndex,
      kind: "pseudo-class",
      selector: `:${node.name}`,
    });
  };

  const renderedCompounds = compounds.map((compound, compoundIndex) => {
    for (const node of compound.nodes) inspectNode(node, compoundIndex);

    const hostConstraints = compound.nodes
      .filter((node) => {
        if (node.type === "TypeSelector") return node.name !== "*";
        if (node.type !== "AttributeSelector") return false;
        const attributeName = node.name?.name ?? "";
        return (
          !STATE_ATTRIBUTES.has(attributeName) &&
          !attributeName.startsWith("aria-") &&
          !attributeName.startsWith("data-")
        );
      })
      .map((node) => cssTree.generate(node));

    return {
      combinatorBefore: compound.combinatorBefore,
      selector: compound.nodes.map((node) => cssTree.generate(node)).join(""),
      hostConstraints,
    };
  });

  return {
    classNames,
    classOccurrences: uniqueBy(
      classOccurrences,
      (occurrence) =>
        `${occurrence.name}:${occurrence.compoundIndex}:${occurrence.relation}`,
    ),
    compounds: renderedCompounds,
    elementOccurrences: uniqueBy(
      elementOccurrences,
      (occurrence) =>
        `${occurrence.name}:${occurrence.compoundIndex}:${occurrence.relation}`,
    ),
    elements,
    states: uniqueBy(
      states,
      (state) => `${state.compoundIndex}:${state.kind}:${state.selector}`,
    ),
  };
}

function collectVarFunctions(value) {
  const references = [];

  for (let index = 0; index < value.length; index++) {
    if (value.slice(index, index + 4).toLowerCase() !== "var(") continue;

    let depth = 1;
    let cursor = index + 4;
    let comma = -1;
    for (; cursor < value.length && depth > 0; cursor++) {
      const character = value[cursor];
      if (character === "(") depth++;
      else if (character === ")") depth--;
      else if (character === "," && depth === 1 && comma === -1) comma = cursor;
    }

    const end = cursor - 1;
    const nameEnd = comma === -1 ? end : comma;
    const name = value.slice(index + 4, nameEnd).trim();
    if (name.startsWith("--")) {
      references.push({
        name,
        fallback:
          comma === -1 ? null : value.slice(comma + 1, end).trim() || null,
      });
    }
  }

  return references;
}

function detectFeatures(text, atRules = []) {
  const features = new Set();
  if (atRules.some((atRule) => atRule.name === "layer")) {
    features.add("cascade-layers");
  }
  if (atRules.some((atRule) => atRule.name === "container")) {
    features.add("container-queries");
  }
  if (
    atRules.some(
      (atRule) =>
        atRule.name === "media" &&
        /forced-colors\s*:\s*active/i.test(atRule.query),
    )
  ) {
    features.add("forced-colors");
  }
  for (const [name, detects] of FEATURE_DETECTORS) {
    if (detects(text)) features.add(name);
  }
  return [...features].sort();
}

function sourceForNode(node, sourcePath, lineOffset) {
  return {
    file: sourcePath,
    line:
      node.loc?.start.line === undefined
        ? null
        : node.loc.start.line + lineOffset,
    column: node.loc?.start.column ?? null,
    endLine:
      node.loc?.end.line === undefined ? null : node.loc.end.line + lineOffset,
  };
}

function parseRawChildren(value) {
  try {
    const wrappedAst = cssTree.parse(`:scope{\n${value}\n}`, {
      parseCustomProperty: true,
      positions: true,
    });
    const wrappedChildren = wrappedAst.children.first?.block?.children;
    if (wrappedChildren?.toArray().some((child) => child.type !== "Raw")) {
      return { children: wrappedChildren, lineOffset: -1 };
    }
  } catch {
    // Relative selectors are retried as standalone stylesheet children below.
  }

  try {
    const nestedAst = cssTree.parse(value, {
      parseCustomProperty: true,
      positions: true,
    });
    return { children: nestedAst.children, lineOffset: 0 };
  } catch {
    return null;
  }
}

function collectSelectorRecords(ast, sourcePath) {
  const records = [];

  const collectDeclarations = (children, context) =>
    (children?.toArray() ?? [])
      .filter((child) => child.type === "Declaration")
      .map((child) => {
        const value = cssTree.generate(child.value);
        return {
          property: child.property,
          value,
          important: child.important === true,
          references: collectVarFunctions(value),
          features: detectFeatures(
            `${child.property}:${value}`,
            context.atRules,
          ),
          source: {
            file: sourcePath,
            line:
              child.loc?.start.line === undefined
                ? null
                : child.loc.start.line + context.lineOffset,
            column: child.loc?.start.column ?? null,
          },
        };
      });

  const recordSelectors = ({
    authoredSelectors,
    context,
    declarations,
    node,
    selectors,
  }) => {
    const source = sourceForNode(node, sourcePath, context.lineOffset);
    for (const selector of selectors) {
      const normalizedSelector = normalizeSelector(selector);
      const inspection = inspectSelector(normalizedSelector);
      const selectorFeatures = detectFeatures(
        normalizedSelector,
        context.atRules,
      );
      records.push({
        selector: normalizedSelector,
        authoredSelector: authoredSelectors.join(","),
        classNames: [...inspection.classNames].sort(),
        classOccurrences: inspection.classOccurrences,
        compounds: inspection.compounds,
        elementOccurrences: inspection.elementOccurrences,
        elements: [...inspection.elements].sort(),
        states: inspection.states,
        layer: context.layer,
        atRules: [...context.atRules],
        declarations,
        selectorFeatures,
        features: [
          ...new Set([
            ...selectorFeatures,
            ...declarations.flatMap((declaration) => declaration.features),
          ]),
        ].sort(),
        source,
      });
    }
  };

  const visit = (children, context) => {
    for (const node of children?.toArray() ?? []) {
      if (node.type === "Raw") {
        const parsed = parseRawChildren(node.value);
        if (!parsed) continue;

        const nestedContext = {
          ...context,
          lineOffset:
            context.lineOffset +
            (node.loc?.start.line ?? 1) -
            1 +
            parsed.lineOffset,
        };
        const declarations = collectDeclarations(
          parsed.children,
          nestedContext,
        );
        if (context.parentSelectors?.length && declarations.length > 0) {
          recordSelectors({
            authoredSelectors:
              context.authoredSelectors ?? context.parentSelectors,
            context: nestedContext,
            declarations,
            node:
              parsed.children
                .toArray()
                .find((child) => child.type === "Declaration") ?? node,
            selectors: context.parentSelectors,
          });
        }
        visit(parsed.children, nestedContext);
        continue;
      }
      if (node.type === "Atrule") {
        if (!node.block) continue;
        if (node.name === "keyframes" || node.name.endsWith("keyframes")) {
          continue;
        }
        const prelude = node.prelude ? cssTree.generate(node.prelude) : "";
        const atRule = { name: node.name, query: prelude };
        const nestedContext = {
          ...context,
          atRules: [...context.atRules, atRule],
          layer: node.name === "layer" ? extractLayerName(node) : context.layer,
        };
        const declarations = collectDeclarations(
          node.block.children,
          nestedContext,
        );
        if (context.parentSelectors?.length && declarations.length > 0) {
          recordSelectors({
            authoredSelectors:
              context.authoredSelectors ?? context.parentSelectors,
            context: nestedContext,
            declarations,
            node,
            selectors: context.parentSelectors,
          });
        }
        visit(node.block.children, nestedContext);
        continue;
      }
      if (node.type !== "Rule" || !node.prelude || !node.block) continue;

      const authoredSelectors = listSelectors(node.prelude);
      const selectors = resolveNestedSelectors(
        authoredSelectors,
        context.parentSelectors,
      );
      const declarations = collectDeclarations(node.block.children, context);
      recordSelectors({
        authoredSelectors,
        context,
        declarations,
        node,
        selectors,
      });

      visit(node.block.children, {
        ...context,
        authoredSelectors,
        parentSelectors: selectors,
      });
    }
  };

  visit(ast.children, {
    atRules: [],
    layer: null,
    lineOffset: 0,
    authoredSelectors: null,
    parentSelectors: null,
  });
  return records;
}

/* ------------------------------------------------------------------ *
 * Walker
 * ------------------------------------------------------------------ */

/**
 * Walk the AST and collect "annotation-required" nodes in source order, then
 * dedupe class targets by name (only the first occurrence is canonical).
 *
 * Targets:
 *   { type: "pattern", name, line }   — first primary class def for that name
 *   { type: "token", name, line }     — custom property at :root inside @layer base
 *
 * Skips:
 *   - Compound / descendant / qualified rules
 *   - Nested rules inside other rules (`&.modifier`)
 *   - Subsequent primary defs of an already-seen class name (overrides)
 *   - :root declarations inside @layer themes (or any non-`base` layer)
 *   - Non-custom-property declarations at :root (e.g. `color-scheme`)
 */
function collectTargets(ast, selectorRecords, annotationComments) {
  const rawTargets = [];

  const topChildren = ast.children?.toArray() ?? [];
  for (const node of topChildren) {
    if (node.type === "Atrule") {
      if (node.name === "layer") {
        if (!node.block) continue; // statement-form `@layer a, b;`
        const layerName = extractLayerName(node);
        walkContainerBlock(node.block, { layerName }, rawTargets);
      } else if (
        ["media", "container", "supports", "scope"].includes(node.name)
      ) {
        // Unlayered query-wrapped block at the top level (e.g. `@media print`).
        // Walk for primary class defs; first occurrence wins after dedupe.
        if (node.block)
          walkContainerBlock(node.block, { layerName: null }, rawTargets);
      }
      // Other top-level atrules (@property, @import, @charset, etc.) — skip.
      continue;
    }
    if (node.type === "Rule") {
      // Unlayered top-level rule. Treat as canonical primary def candidate.
      const classification = classifyRule(node);
      if (classification.kind === "primary-class") {
        rawTargets.push({
          type: "pattern",
          name: classification.name,
          line: node.loc?.start.line ?? -1,
          endLine: node.loc?.end.line ?? -1,
          layer: null,
        });
      }
    }
  }

  const patternAnnotations = annotationComments.filter(
    (annotation) =>
      annotation.kind === "pattern" || annotation.kind === "pattern-group",
  );
  const annotatedPatternNames = new Set(
    patternAnnotations.flatMap((annotation) =>
      annotation.kind === "pattern"
        ? [annotation.tags.get("pattern")?.trim()].filter(Boolean)
        : (annotation.tags.get("members") ?? "")
            .split(",")
            .map((name) => name.trim())
            .filter(Boolean),
    ),
  );
  const annotatedTargets = [];

  for (let index = 0; index < patternAnnotations.length; index++) {
    const annotation = patternAnnotations[index];
    const nextAnnotationLine =
      patternAnnotations[index + 1]?.line ?? Number.POSITIVE_INFINITY;
    const explicitSelector = annotation.tags.get("selector")?.trim();
    const candidates = selectorRecords.filter(
      (record) =>
        record.source.line > annotation.endLine &&
        record.source.line < nextAnnotationLine &&
        (record.classNames.length > 0 || explicitSelector),
    );
    const expectedNames =
      annotation.kind === "pattern"
        ? [annotation.tags.get("pattern")?.trim()].filter(Boolean)
        : (annotation.tags.get("members") ?? "")
            .split(",")
            .map((name) => name.trim())
            .filter(Boolean);
    let minimumLine = annotation.endLine;

    for (const expectedName of expectedNames) {
      const available = candidates.filter(
        (candidate) => candidate.source.line >= minimumLine,
      );
      const targetRecord =
        (explicitSelector
          ? available.find(
              (candidate) =>
                candidate.selector === normalizeSelector(explicitSelector),
            )
          : available.find((candidate) =>
              candidate.classNames.includes(expectedName),
            )) ?? available[0];
      if (!targetRecord) break;

      const name = explicitSelector
        ? expectedName
        : targetRecord.classNames.includes(expectedName)
          ? expectedName
          : targetRecord.classNames[0];
      annotatedTargets.push({
        type: "pattern",
        name,
        line: targetRecord.source.line,
        endLine: targetRecord.source.endLine,
        layer: targetRecord.layer,
        selector: targetRecord.selector,
        selectors: selectorRecords
          .filter((record) => record.source.line === targetRecord.source.line)
          .map((record) => record.selector),
      });
      minimumLine = targetRecord.source.line + 1;
    }
  }

  const combinedTargets = [
    ...rawTargets.filter(
      (target) =>
        target.type !== "pattern" || !annotatedPatternNames.has(target.name),
    ),
    ...annotatedTargets,
  ].sort((a, b) => a.line - b.line || a.name.localeCompare(b.name));

  // Dedupe unannotated class targets by name (first occurrence wins). Annotated
  // targets remain one-per-block so duplicate annotations can be diagnosed.
  const seenClasses = new Set();
  const deduped = [];
  const annotatedTargetSet = new Set(annotatedTargets);
  for (const t of combinedTargets) {
    if (t.type === "pattern") {
      if (!annotatedTargetSet.has(t) && seenClasses.has(t.name)) continue;
      seenClasses.add(t.name);
      if (!t.selector) {
        const record = selectorRecords.find(
          (candidate) => candidate.source.line === t.line,
        );
        if (record) {
          t.selector = record.selector;
          t.selectors = selectorRecords
            .filter((candidate) => candidate.source.line === t.line)
            .map((candidate) => candidate.selector);
        }
      }
    }
    deduped.push(t);
  }
  return deduped;
}

/**
 * Inventory custom properties from the CSS token stream rather than only from
 * the parsed AST. css-tree intentionally leaves some nested CSS syntax as Raw,
 * but declarations and var() references inside those regions are still part of
 * Graffiti's token contract.
 */
function collectTokenInventory(source, ast) {
  const records = new Map();
  const functionStack = [];
  const lineStarts = [0];
  let declarationCandidate = null;
  let expectsPropertyName = false;

  for (let index = 0; index < source.length; index++) {
    if (source.charCodeAt(index) === 10) lineStarts.push(index + 1);
  }

  const lineAt = (offset) => {
    let low = 0;
    let high = lineStarts.length;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (lineStarts[middle] <= offset) low = middle + 1;
      else high = middle;
    }
    return low;
  };

  const recordFor = (name, offset) => {
    if (!records.has(name)) {
      records.set(name, {
        name,
        firstOffset: offset,
        firstLine: lineAt(offset),
        declarations: [],
        consumptions: [],
        registrations: [],
      });
    }
    const record = records.get(name);
    if (offset < record.firstOffset) {
      record.firstOffset = offset;
      record.firstLine = lineAt(offset);
    }
    return record;
  };

  cssTree.tokenize(source, (type, start, end) => {
    const value = source.slice(start, end);

    if (
      type === cssTree.tokenTypes.Comment ||
      type === cssTree.tokenTypes.WhiteSpace
    ) {
      return;
    }

    if (type === cssTree.tokenTypes.AtKeyword) {
      expectsPropertyName = value.toLowerCase() === "@property";
      declarationCandidate = null;
      return;
    }

    if (
      expectsPropertyName &&
      type === cssTree.tokenTypes.Ident &&
      value.startsWith("--")
    ) {
      recordFor(value, start).registrations.push({ line: lineAt(start) });
      expectsPropertyName = false;
      declarationCandidate = null;
      return;
    }

    if (type === cssTree.tokenTypes.Function) {
      functionStack.push({
        isVar: value.toLowerCase() === "var(",
        name: null,
        start,
      });
      declarationCandidate = null;
      return;
    }

    if (type === cssTree.tokenTypes.LeftParenthesis) {
      functionStack.push(null);
      declarationCandidate = null;
      return;
    }

    if (type === cssTree.tokenTypes.RightParenthesis) {
      const functionState = functionStack.pop();
      if (functionState?.isVar && functionState.name) {
        recordFor(functionState.name, functionState.start).consumptions.push({
          line: lineAt(functionState.start),
        });
      }
      declarationCandidate = null;
      return;
    }

    const functionState = functionStack.at(-1);
    if (
      functionState?.isVar &&
      functionState.name === null &&
      type === cssTree.tokenTypes.Ident &&
      value.startsWith("--")
    ) {
      functionState.name = value;
      declarationCandidate = null;
      return;
    }

    if (type === cssTree.tokenTypes.Ident && value.startsWith("--")) {
      declarationCandidate = { name: value, start };
      return;
    }

    if (type === cssTree.tokenTypes.Colon && declarationCandidate) {
      recordFor(
        declarationCandidate.name,
        declarationCandidate.start,
      ).declarations.push({ line: lineAt(declarationCandidate.start) });
      declarationCandidate = null;
      return;
    }

    declarationCandidate = null;
  });

  const propertyRegistrations = new Map();
  const themeScopedTokens = new Set();

  cssTree.walk(ast, {
    visit: "Atrule",
    enter(node) {
      if (node.name !== "property" || !node.prelude) return;
      const name = cssTree.generate(node.prelude).trim();
      if (!name.startsWith("--")) return;

      const registration = {
        inherits: true,
        initialValue: null,
        syntax: null,
        source: {
          line: node.loc?.start.line ?? null,
          column: node.loc?.start.column ?? null,
        },
      };
      for (const child of node.block?.children?.toArray() ?? []) {
        if (child.type !== "Declaration") continue;
        const value = cssTree.generate(child.value).trim();
        if (child.property === "inherits")
          registration.inherits = value !== "false";
        else if (child.property === "initial-value")
          registration.initialValue = value;
        else if (child.property === "syntax") registration.syntax = value;
      }
      propertyRegistrations.set(name, registration);
    },
  });

  cssTree.walk(ast, {
    visit: "Rule",
    enter(node) {
      if (!node.prelude || !node.block) return;
      const selector = cssTree.generate(node.prelude);
      if (!selector.includes('[class*="theme-"]')) return;

      cssTree.walk(node.block, {
        visit: "Declaration",
        enter(declaration) {
          if (declaration.property?.startsWith("--")) {
            themeScopedTokens.add(declaration.property);
          }
        },
      });
    },
  });

  return {
    records: [...records.values()].sort((a, b) => a.name.localeCompare(b.name)),
    propertyRegistrations,
    themeScopedTokens,
  };
}

function extractLayerName(layerAtrule) {
  // Structure: Atrule.prelude -> AtrulePrelude -> LayerList -> Layer { name }
  const prelude = layerAtrule.prelude;
  if (!prelude) return null;
  const layerList = prelude.children?.first;
  if (!layerList) return null;
  // Block-form `@layer base { ... }` carries a LayerList with one Layer.
  // Statement-form `@layer base, themes;` carries a LayerList with multiple
  // Layers — we skip that elsewhere because there's no block.
  const firstLayer = layerList.children?.first;
  return firstLayer?.name ?? null;
}

/**
 * Walk a block that may contain Rules and adaptive Atrules (@media, @container,
 * @supports, @scope). Adaptive Atrules recurse — their inner rules are also
 * considered primary-def candidates (first one per name wins via dedupe).
 *
 * `layerName` is the enclosing @layer's name (or null if unlayered). Token
 * collection only happens when layerName === "base".
 */
function walkContainerBlock(block, ctx, targets) {
  const children = block.children?.toArray() ?? [];
  for (const child of children) {
    if (child.type === "Atrule") {
      if (["media", "container", "supports", "scope"].includes(child.name)) {
        if (child.block) walkContainerBlock(child.block, ctx, targets);
      }
      // @property and other atrules — skip
      continue;
    }
    if (child.type !== "Rule") continue;

    const classification = classifyRule(child);
    if (classification.kind === "primary-class") {
      targets.push({
        type: "pattern",
        name: classification.name,
        line: child.loc?.start.line ?? -1,
        endLine: child.loc?.end.line ?? -1,
        layer: ctx.layerName,
      });
      // Do NOT recurse into the rule's block — internal/nested rules are exempt.
    } else if (classification.kind === "root" && ctx.layerName === "base") {
      const rootChildren = child.block?.children?.toArray() ?? [];
      for (const decl of rootChildren) {
        if (decl.type !== "Declaration") continue;
        if (!decl.property.startsWith("--")) continue;
        targets.push({
          type: "token",
          name: decl.property,
          line: decl.loc?.start.line ?? -1,
          endLine: decl.loc?.end.line ?? -1,
          layer: ctx.layerName,
        });
      }
    }
    // compound / other — exempt
  }
}

/* ------------------------------------------------------------------ *
 * Annotation pairing
 * ------------------------------------------------------------------ */

/**
 * Pair annotation comments with the targets they claim, in source order.
 *
 * Claim rules by annotation kind:
 *   - @pattern  : claims exactly the next target (must be type=pattern)
 *   - @token    : claims exactly the next target (must be type=token)
 *   - @pattern-group : claims the next N pattern targets where
 *                       N = the count of names in @members (in order)
 *   - @token-group   : claims subsequent token targets that match @matches,
 *                       stopping at the first non-match
 *
 * After each block claim, control returns to the outer loop: the NEXT target
 * (if any) must have its own annotation, or it becomes an orphan target.
 *
 * Returns: { blocks, orphanTargets, orphanAnnotations }
 */
function pairAnnotationsToTargets(annotationComments, targets) {
  const annotations = annotationComments
    .filter((c) => c.kind !== null && c.kind !== "token-set")
    .sort((a, b) => a.line - b.line);

  const blocks = [];
  const orphanTargets = [];
  const usedAnnotations = new Set();

  let aIdx = 0;
  let tIdx = 0;

  while (tIdx < targets.length) {
    const target = targets[tIdx];
    // Skip annotations whose line is past the current target's line — they
    // belong to later targets, not this one.
    while (aIdx < annotations.length && annotations[aIdx].line >= target.line) {
      // Annotation comes after target → target has no annotation
      break;
    }

    // Is there an annotation at or before this target line that hasn't been used?
    const nextAnnotation = annotations[aIdx];
    if (!nextAnnotation || nextAnnotation.line > target.line) {
      // Target with no preceding annotation = orphan
      orphanTargets.push(target);
      tIdx++;
      continue;
    }

    // Build a block and claim per kind
    const block = { annotation: nextAnnotation, targets: [] };
    usedAnnotations.add(nextAnnotation);
    aIdx++;

    if (nextAnnotation.kind === "pattern" || nextAnnotation.kind === "token") {
      // Claim exactly this one target — validation will check kind match.
      block.targets.push(target);
      tIdx++;
    } else if (nextAnnotation.kind === "pattern-group") {
      const members = (nextAnnotation.tags.get("members") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const n = members.length;
      for (let k = 0; k < n && tIdx < targets.length; k++) {
        const t = targets[tIdx];
        if (t.type !== "pattern") break;
        block.targets.push(t);
        tIdx++;
      }
      // If members.length is 0 (invalid), still claim the current target so
      // the validation error attaches to this block, not orphan.
      if (n === 0) {
        block.targets.push(target);
        tIdx++;
      }
    } else if (nextAnnotation.kind === "token-group") {
      const matchesRaw = (nextAnnotation.tags.get("matches") ?? "").trim();
      const regex = matchesRaw ? globToRegex(matchesRaw) : null;
      while (tIdx < targets.length) {
        const t = targets[tIdx];
        if (t.type !== "token") break;
        if (regex && !regex.test(t.name)) break;
        block.targets.push(t);
        tIdx++;
      }
      // If @matches missing/empty, claim just the current target so the
      // required-tags violation attaches to this block.
      if (block.targets.length === 0) {
        block.targets.push(target);
        tIdx++;
      }
    }

    blocks.push(block);
  }

  const orphanAnnotations = annotations.filter((a) => !usedAnnotations.has(a));
  return { blocks, orphanTargets, orphanAnnotations };
}

/* ------------------------------------------------------------------ *
 * Validation rules
 * ------------------------------------------------------------------ */

function validateBlock(block, violations) {
  const { annotation, targets } = block;
  const { kind, tags, duplicates, line: aLine } = annotation;

  for (const d of duplicates) {
    violations.push({
      line: aLine,
      message: `Duplicate @${d} tag in annotation block`,
      rule: "no-duplicate-tags",
    });
  }

  const required = REQUIRED_TAGS[kind];
  for (const t of required) {
    if (!tags.has(t)) {
      violations.push({
        line: aLine,
        message: `Missing required tag @${t} in @${kind} block`,
        rule: "required-tags",
      });
    }
  }

  // Kind-specific checks
  if (kind === "pattern") {
    validatePattern(annotation, targets, violations);
    validatePatternContractTags(annotation, violations);
  } else if (kind === "pattern-group") {
    validatePatternGroup(annotation, targets, violations);
    validatePatternContractTags(annotation, violations);
  } else if (kind === "token") {
    validateToken(annotation, targets, violations);
  } else if (kind === "token-group") {
    validateTokenGroup(annotation, targets, violations);
  }

  // @example shape (when present)
  if (tags.has("example")) {
    const ex = tags.get("example").trim();
    if (!ex.length) {
      violations.push({
        line: aLine,
        message: `@example is empty`,
        rule: "example-syntax",
      });
    } else if (!/<[a-zA-Z]/.test(ex)) {
      violations.push({
        line: aLine,
        message: `@example must contain at least one HTML element`,
        rule: "example-syntax",
      });
    }
  }

  // @category vocabulary
  if (tags.has("category")) {
    const cat = tags.get("category").trim();
    if (!TOKEN_CATEGORIES.has(cat)) {
      violations.push({
        line: aLine,
        message: `Unknown @category "${cat}"; allowed: ${[...TOKEN_CATEGORIES].join(", ")}`,
        rule: "category-vocabulary",
      });
    }
  }
}

function validatePatternContractTags(annotation, violations) {
  const { tags, line } = annotation;
  const validateSelector = (selector, tag) => {
    try {
      cssTree.parse(selector, { context: "selector" });
    } catch {
      violations.push({
        line,
        message: `@${tag} contains invalid selector ${JSON.stringify(selector)}`,
        rule: "pattern-contract-grammar",
      });
    }
  };

  if (tags.has("selector")) {
    validateSelector(tags.get("selector").trim(), "selector");
  }
  for (const host of parseLines(tags.get("qualified-hosts"))) {
    validateSelector(host, "qualified-hosts");
  }

  const namedSelectorTags = ["modifier-selectors", "states", "state-aliases"];
  for (const tag of namedSelectorTags) {
    for (const contractLine of parseLines(tags.get(tag))) {
      const match = /^([a-z][a-z0-9-]*):\s*(.+)$/i.exec(contractLine);
      if (!match) {
        violations.push({
          line,
          message: `@${tag} entry must use "name: selector": ${JSON.stringify(contractLine)}`,
          rule: "pattern-contract-grammar",
        });
        continue;
      }
      validateSelector(
        match[2].includes("&") ? match[2].replaceAll("&", ".owner") : match[2],
        tag,
      );
    }
  }

  const modifierNames = new Set(parseList(tags.get("modifiers")));
  for (const contract of parseNamedSelectors(
    tags.get("modifier-selectors"),
    null,
  )) {
    if (modifierNames.has(contract.name)) continue;
    violations.push({
      line,
      message: `@modifier-selectors defines ${contract.name}, but it is not listed in @modifiers`,
      rule: "pattern-contract-grammar",
    });
  }

  const stateNames = new Set(
    parseNamedSelectors(tags.get("states"), null).map((state) => state.name),
  );
  for (const alias of parseNamedSelectors(tags.get("state-aliases"), null)) {
    if (stateNames.has(alias.name)) continue;
    violations.push({
      line,
      message: `@state-aliases references unknown state ${alias.name}`,
      rule: "pattern-contract-grammar",
    });
  }

  for (const slotLine of parseLines(tags.get("slots"))) {
    const match = /^(required|optional)(?:\s+[a-z][a-z0-9-]*:)?\s+(.+)$/i.exec(
      slotLine,
    );
    if (!match) {
      violations.push({
        line,
        message: `@slots entry must begin with required/optional and may include "name:": ${JSON.stringify(slotLine)}`,
        rule: "pattern-contract-grammar",
      });
      continue;
    }
    validateSelector(
      /^(?:[>+~]|\|\|)/.test(match[2]) ? `:scope ${match[2]}` : match[2],
      "slots",
    );
  }

  const lifecycle = parseLifecycle(tags.get("lifecycle"));
  if (lifecycle) validateLifecycle(lifecycle, "@lifecycle", line, violations);

  const aliasNames = new Set([
    ...parseList(tags.get("aliases")).map((name) => name.replace(/^\./, "")),
    ...parseList(tags.get("selector-aliases")),
  ]);
  for (const [name, aliasLifecycle] of parseAliasLifecycles(
    tags.get("alias-lifecycle"),
  )) {
    if (!aliasNames.has(name)) {
      violations.push({
        line,
        message: `@alias-lifecycle references unknown alias ${name}`,
        rule: "pattern-contract-grammar",
      });
    }
    validateLifecycle(
      aliasLifecycle,
      `@alias-lifecycle ${name}`,
      line,
      violations,
    );
  }
}

function validateLifecycle(lifecycle, label, line, violations) {
  if (!LIFECYCLE_STATUSES.has(lifecycle.status)) {
    violations.push({
      line,
      message: `${label} has unknown status ${JSON.stringify(lifecycle.status)}; allowed: ${[...LIFECYCLE_STATUSES].join(", ")}`,
      rule: "lifecycle-contract",
    });
    return;
  }
  if (
    lifecycle.status === "deprecated" &&
    (!lifecycle.since || !lifecycle.removalVersion || !lifecycle.replacement)
  ) {
    violations.push({
      line,
      message: `${label} deprecated lifecycle requires since=, remove=, and replacement= metadata`,
      rule: "lifecycle-contract",
    });
  }
}

function validatePattern(annotation, targets, violations) {
  const { tags, line: aLine } = annotation;
  const name = tags.get("pattern")?.trim();

  // @pattern annotates exactly ONE target, of type "pattern"
  const patternTargets = targets.filter((t) => t.type === "pattern");
  const tokenTargets = targets.filter((t) => t.type === "token");

  if (tokenTargets.length > 0) {
    violations.push({
      line: aLine,
      message: `@pattern block annotates token(s): ${tokenTargets.map((t) => t.name).join(", ")}`,
      rule: "kind-mismatch",
    });
  }

  if (patternTargets.length === 0) {
    violations.push({
      line: aLine,
      message: `@pattern ${name ?? "?"} has no class definition immediately following it`,
      rule: "orphan-annotation",
    });
    return;
  }

  const first = patternTargets[0];
  if (name !== first.name) {
    violations.push({
      line: aLine,
      message: `@pattern ${name} does not match following selector .${first.name}`,
      rule: "name-agreement",
    });
  }
  const selector = tags.get("selector")?.trim();
  if (selector && normalizeSelector(selector) !== first.selector) {
    violations.push({
      line: aLine,
      message: `@selector ${selector} does not match following selector ${first.selector}`,
      rule: "selector-agreement",
    });
  }
}

function validatePatternGroup(annotation, targets, violations) {
  const { tags, line: aLine } = annotation;
  const groupName = tags.get("pattern-group")?.trim();
  const membersRaw = tags.get("members") ?? "";
  const members = membersRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const patternTargets = targets.filter((t) => t.type === "pattern");
  const tokenTargets = targets.filter((t) => t.type === "token");

  if (tokenTargets.length > 0) {
    violations.push({
      line: aLine,
      message: `@pattern-group ${groupName} annotates token(s): ${tokenTargets.map((t) => t.name).join(", ")}`,
      rule: "kind-mismatch",
    });
  }

  if (patternTargets.length === 0) {
    violations.push({
      line: aLine,
      message: `@pattern-group ${groupName} has no class definitions following it`,
      rule: "orphan-annotation",
    });
    return;
  }

  const actualNames = patternTargets.map((t) => t.name);
  // Exact equality, in order
  if (actualNames.length !== members.length) {
    violations.push({
      line: aLine,
      message: `@pattern-group ${groupName} @members count (${members.length}) does not match following class defs (${actualNames.length}: ${actualNames.map((n) => "." + n).join(", ")})`,
      rule: "members-exact",
    });
    return;
  }
  for (let i = 0; i < members.length; i++) {
    if (members[i] !== actualNames[i]) {
      violations.push({
        line: aLine,
        message: `@pattern-group ${groupName} @members[${i}] = "${members[i]}" but actual class at line ${patternTargets[i].line} is .${actualNames[i]}`,
        rule: "members-exact",
      });
    }
  }
}

function validateToken(annotation, targets, violations) {
  const { tags, line: aLine } = annotation;
  const name = tags.get("token")?.trim();

  const tokenTargets = targets.filter((t) => t.type === "token");
  const patternTargets = targets.filter((t) => t.type === "pattern");

  if (patternTargets.length > 0) {
    violations.push({
      line: aLine,
      message: `@token block annotates class(es): ${patternTargets.map((t) => "." + t.name).join(", ")}`,
      rule: "kind-mismatch",
    });
  }

  if (tokenTargets.length === 0) {
    violations.push({
      line: aLine,
      message: `@token ${name ?? "?"} has no custom property declaration immediately following it`,
      rule: "orphan-annotation",
    });
    return;
  }

  const first = tokenTargets[0];
  if (name !== first.name) {
    violations.push({
      line: aLine,
      message: `@token ${name} does not match following declaration ${first.name}`,
      rule: "name-agreement",
    });
  }
}

function validateTokenGroup(annotation, targets, violations) {
  const { tags, line: aLine } = annotation;
  const groupName = tags.get("token-group")?.trim();
  const matches = tags.get("matches")?.trim();

  const tokenTargets = targets.filter((t) => t.type === "token");
  const patternTargets = targets.filter((t) => t.type === "pattern");

  if (patternTargets.length > 0) {
    violations.push({
      line: aLine,
      message: `@token-group ${groupName} annotates class(es): ${patternTargets.map((t) => "." + t.name).join(", ")}`,
      rule: "kind-mismatch",
    });
  }

  if (tokenTargets.length === 0) {
    violations.push({
      line: aLine,
      message: `@token-group ${groupName} has no token declarations following it`,
      rule: "orphan-annotation",
    });
    return;
  }

  if (!matches) {
    // already flagged by required-tags
    return;
  }

  const regex = globToRegex(matches);
  for (const t of tokenTargets) {
    if (!regex.test(t.name)) {
      violations.push({
        line: aLine,
        message: `@token-group ${groupName} @matches "${matches}" does not cover ${t.name} (line ${t.line})`,
        rule: "matches-exhaustive",
      });
    }
  }
}

/**
 * Convert a glob (or comma-separated list of globs) like
 *   `--vs-*`
 *   `--yellow, --amber, --orange`
 *   `--yellow-*, --amber-*`
 * to a RegExp that matches any of the listed patterns. `*` is the only
 * wildcard; everything else is literal.
 */
function globToRegex(glob) {
  const parts = glob
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return /^$/;
  const escapedParts = parts.map((p) =>
    p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*"),
  );
  return new RegExp("^(?:" + escapedParts.join("|") + ")$");
}

function validateTokenSets(annotations, tokenInventory, violations) {
  const tokenSets = [];
  const classificationByToken = new Map();

  for (const annotation of annotations.filter(
    (candidate) => candidate.kind === "token-set",
  )) {
    const { tags, duplicates, line } = annotation;

    for (const duplicate of duplicates) {
      violations.push({
        line,
        message: `Duplicate @${duplicate} tag in @token-set block`,
        rule: "no-duplicate-tags",
      });
    }

    for (const tag of REQUIRED_TAGS["token-set"]) {
      if (!tags.has(tag)) {
        violations.push({
          line,
          message: `Missing required tag @${tag} in @token-set block`,
          rule: "required-tags",
        });
      }
    }

    const name = tags.get("token-set")?.trim() ?? "";
    const matches = tags.get("matches")?.trim() ?? "";
    const tier = tags.get("tier")?.trim() ?? "";
    const visibility = tags.get("visibility")?.trim() ?? "";
    const defaultStability = tags.get("default")?.trim() ?? "";
    const role = tags.get("role")?.trim() ?? "";

    if (tier && !TOKEN_TIERS.has(tier)) {
      violations.push({
        line,
        message: `Unknown @tier "${tier}"; allowed: ${[...TOKEN_TIERS].join(", ")}`,
        rule: "token-tier-vocabulary",
      });
    }
    if (visibility && !TOKEN_VISIBILITIES.has(visibility)) {
      violations.push({
        line,
        message: `Unknown @visibility "${visibility}"; allowed: ${[...TOKEN_VISIBILITIES].join(", ")}`,
        rule: "token-visibility-vocabulary",
      });
    }
    if (defaultStability && !TOKEN_DEFAULT_STABILITIES.has(defaultStability)) {
      violations.push({
        line,
        message: `Unknown @default "${defaultStability}"; allowed: ${[...TOKEN_DEFAULT_STABILITIES].join(", ")}`,
        rule: "token-default-vocabulary",
      });
    }

    if (
      (tier === "private-calculated" && visibility !== "private") ||
      (tier && tier !== "private-calculated" && visibility === "private")
    ) {
      violations.push({
        line,
        message: `@tier ${tier} requires @visibility ${tier === "private-calculated" ? "private" : "public"}`,
        rule: "token-tier-visibility",
      });
    }

    const regex = matches ? globToRegex(matches) : /^$/;
    const members = tokenInventory.records
      .filter((token) => regex.test(token.name))
      .map((token) => token.name);

    if (matches && members.length === 0) {
      violations.push({
        line,
        message: `@token-set ${name || "?"} @matches "${matches}" does not match any declared, registered, or consumed token`,
        rule: "token-set-empty",
      });
    }

    const tokenSet = {
      name,
      matches,
      tier,
      visibility,
      defaultStability,
      role,
      source: { line },
      members,
    };
    tokenSets.push(tokenSet);

    for (const tokenName of members) {
      const previous = classificationByToken.get(tokenName);
      if (previous) {
        violations.push({
          line,
          message: `Token ${tokenName} is classified by both @token-set ${previous.name} (line ${previous.source.line}) and ${name}`,
          rule: "token-classification-overlap",
        });
        continue;
      }
      classificationByToken.set(tokenName, tokenSet);
    }

    const isLegacyPrivateSet = tags.get("legacy-name")?.trim() === "allowed";
    for (const token of tokenInventory.records.filter((candidate) =>
      members.includes(candidate.name),
    )) {
      const hasDefinition =
        token.declarations.length > 0 || token.registrations.length > 0;

      if (defaultStability === "stable" && !hasDefinition) {
        violations.push({
          line: token.firstLine,
          message: `Token ${token.name} is @default stable but has no declaration or @property initial value`,
          rule: "token-default-stability",
        });
      }
      if (
        defaultStability === "fallback" &&
        (token.consumptions.length === 0 || hasDefinition)
      ) {
        violations.push({
          line: token.firstLine,
          message: `Token ${token.name} is @default fallback but must be consumed and have no canonical declaration`,
          rule: "token-default-stability",
        });
      }
      if (defaultStability === "calculated" && !hasDefinition) {
        violations.push({
          line: token.firstLine,
          message: `Token ${token.name} is @default calculated but has no framework calculation`,
          rule: "token-default-stability",
        });
      }

      if (
        tier === "private-calculated" &&
        !token.name.startsWith(PRIVATE_TOKEN_PREFIX) &&
        !isLegacyPrivateSet
      ) {
        violations.push({
          line: token.firstLine,
          message: `Private token ${token.name} must use the ${PRIVATE_TOKEN_PREFIX}* convention; @legacy-name allowed is reserved for the inventoried pre-v2 names`,
          rule: "private-token-name",
        });
      }
      if (
        visibility === "public" &&
        token.name.startsWith(PRIVATE_TOKEN_PREFIX)
      ) {
        violations.push({
          line: token.firstLine,
          message: `Public token ${token.name} uses the reserved private prefix ${PRIVATE_TOKEN_PREFIX}`,
          rule: "private-token-name",
        });
      }
    }
  }

  for (const token of tokenInventory.records) {
    if (!classificationByToken.has(token.name)) {
      violations.push({
        line: token.firstLine,
        message: `Unclassified token ${token.name}; add it to exactly one @token-set with tier, visibility, default stability, and role metadata`,
        rule: "token-classification",
      });
    }
  }

  return { tokenSets, classificationByToken };
}

/* ------------------------------------------------------------------ *
 * Cross-block validation (related resolution, duplicates)
 * ------------------------------------------------------------------ */

function validateCrossBlock(blocks, allAnnotations, violations) {
  // Scan ALL annotations (paired + orphan) for duplicate names within the same kind.
  const seen = new Map(); // key "kind:name" -> first line
  for (const a of allAnnotations) {
    if (!a.kind) continue;
    const name = a.tags.get(a.kind)?.trim();
    if (!name) continue;
    const key = `${a.kind}:${name}`;
    if (seen.has(key)) {
      violations.push({
        line: a.line,
        message: `Duplicate @${a.kind} ${name} (already declared at line ${seen.get(key)})`,
        rule: "no-duplicates",
      });
    } else {
      seen.set(key, a.line);
    }
  }

  // @related resolution
  const registeredPatternNames = new Set(
    blocks
      .filter((b) => b.annotation.kind === "pattern")
      .map((b) => b.annotation.tags.get("pattern")?.trim())
      .filter(Boolean),
  );
  const registeredGroupNames = new Set(
    blocks
      .filter((b) => b.annotation.kind === "pattern-group")
      .map((b) => b.annotation.tags.get("pattern-group")?.trim())
      .filter(Boolean),
  );
  const allPatternish = new Set([
    ...registeredPatternNames,
    ...registeredGroupNames,
  ]);

  for (const b of blocks) {
    if (
      b.annotation.kind !== "pattern" &&
      b.annotation.kind !== "pattern-group"
    ) {
      continue;
    }
    const relatedRaw = b.annotation.tags.get("related");
    if (!relatedRaw) continue;
    const related = relatedRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const r of related) {
      if (!allPatternish.has(r)) {
        violations.push({
          line: b.annotation.line,
          message: `@related "${r}" does not resolve to any registered pattern or pattern-group`,
          rule: "related-resolves",
        });
      }
    }
  }
}

/* ------------------------------------------------------------------ *
 * Registry assembly
 * ------------------------------------------------------------------ */

function uniqueBy(items, keyFor) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFor(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseList(value) {
  return value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function parseLines(value) {
  return value
    ? value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    : [];
}

function parseNamedSelectors(value, source) {
  return parseLines(value).flatMap((line) => {
    const match = /^([a-z][a-z0-9-]*):\s*(.+)$/i.exec(line);
    if (!match) return [];
    return [{ name: match[1], selector: match[2], source }];
  });
}

function parseSlots(value, source) {
  return parseLines(value).map((line) => {
    const match =
      /^(required|optional)(?:\s+([a-z][a-z0-9-]*):)?\s+(.+)$/i.exec(line);
    const selector = match?.[3] ?? line;
    return {
      name: match?.[2] ?? null,
      selector,
      required: match?.[1] === "required",
      direct: selector.startsWith(">"),
      source,
    };
  });
}

function parseAliasDeprecations(value) {
  const deprecations = new Map();
  if (!value) return deprecations;
  for (const line of value.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    deprecations.set(
      line.slice(0, separator).trim().replace(/^\./, ""),
      line.slice(separator + 1).trim(),
    );
  }
  return deprecations;
}

function parseLifecycleFields(value) {
  const [status = "active", ...fields] = value
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
  const metadata = new Map(
    fields.flatMap((field) => {
      const separator = field.indexOf("=");
      return separator === -1
        ? []
        : [
            [
              field.slice(0, separator).trim(),
              field.slice(separator + 1).trim(),
            ],
          ];
    }),
  );
  return {
    status,
    since: metadata.get("since") ?? null,
    removalVersion: metadata.get("remove") ?? null,
    replacement: metadata.get("replacement") ?? null,
    reason: metadata.get("reason") ?? null,
  };
}

function parseLifecycle(value) {
  return value ? parseLifecycleFields(value.trim()) : null;
}

function parseAliasLifecycles(value) {
  const lifecycles = new Map();
  for (const line of parseLines(value)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    lifecycles.set(
      line.slice(0, separator).trim().replace(/^\./, ""),
      parseLifecycleFields(line.slice(separator + 1).trim()),
    );
  }
  return lifecycles;
}

function relationClasses(selector, ownerName) {
  const inspectable = selector.includes("&")
    ? selector.replaceAll("&", `.${ownerName}`)
    : /^(?:[>+~]|\|\|)/.test(selector)
      ? `.${ownerName} ${selector}`
      : `.${ownerName} ${selector}`;
  return [...inspectSelector(inspectable).classNames].filter(
    (name) => name !== ownerName,
  );
}

function buildModifierContracts(tags, owner, source) {
  const overrides = new Map(
    parseNamedSelectors(tags.get("modifier-selectors"), source).map(
      (contract) => [contract.name, contract],
    ),
  );
  return parseList(tags.get("modifiers")).map((name) => {
    const selector = overrides.get(name)?.selector ?? `&.${name}`;
    return {
      name,
      kind: "modifier",
      owner,
      selector,
      classes: relationClasses(selector, owner),
      source,
    };
  });
}

function buildStateContracts(tags, owner, source) {
  const contracts = new Map();
  for (const state of parseNamedSelectors(tags.get("states"), source)) {
    const contract = contracts.get(state.name) ?? {
      name: state.name,
      kind: "state",
      owner,
      selectors: [],
      aliases: [],
      source,
    };
    contract.selectors.push({
      selector: state.selector,
      classes: relationClasses(state.selector, owner),
      source,
    });
    contracts.set(state.name, contract);
  }
  for (const alias of parseNamedSelectors(tags.get("state-aliases"), source)) {
    const contract = contracts.get(alias.name);
    if (!contract) continue;
    contract.aliases.push({
      kind: "selector",
      selector: alias.selector,
      classes: relationClasses(alias.selector, owner),
      source,
    });
  }
  return [...contracts.values()];
}

function bundlesForLayer(layer, bundles) {
  return bundles
    .filter((bundle) => bundle.layers.includes(layer ?? "unlayered"))
    .map((bundle) => bundle.name)
    .sort();
}

function patternOwnerNames(pattern) {
  if (typeof pattern === "string") return [pattern];
  const canonicalClasses = [
    ...inspectSelector(pattern.canonicalSelector).classNames,
  ];
  return [
    ...canonicalClasses,
    ...pattern.aliases
      .filter((alias) => alias.kind === "class")
      .map((alias) => alias.name),
  ];
}

function patternOccurrences(record, pattern) {
  if (typeof pattern === "string") {
    return record.classOccurrences.filter(
      (occurrence) =>
        occurrence.name === pattern && occurrence.relation !== "relative",
    );
  }

  const canonical = inspectSelector(pattern.canonicalSelector);
  const canonicalClassNames = new Set(canonical.classNames);
  const canonicalElementNames = new Set(
    canonicalClassNames.size === 0 ? canonical.elements : [],
  );
  const aliasClassNames = new Set(
    pattern.aliases
      .filter((alias) => alias.kind === "class")
      .map((alias) => alias.name),
  );
  const selectorAliasElements = new Set(
    pattern.aliases
      .filter((alias) => alias.kind === "selector")
      .flatMap((alias) => [
        ...inspectSelector(alias.canonicalSelector).elements,
      ]),
  );

  return [
    ...record.classOccurrences.flatMap((occurrence) => {
      if (occurrence.relation === "relative") return [];
      if (canonicalClassNames.has(occurrence.name)) {
        return [{ ...occurrence, ownerKind: "canonical" }];
      }
      if (aliasClassNames.has(occurrence.name)) {
        return [{ ...occurrence, ownerKind: "alias" }];
      }
      return [];
    }),
    ...record.elementOccurrences.flatMap((occurrence) => {
      if (occurrence.relation === "relative") return [];
      if (canonicalElementNames.has(occurrence.name)) {
        return [{ ...occurrence, ownerKind: "canonical" }];
      }
      if (
        occurrence.compoundIndex === 0 &&
        selectorAliasElements.has(occurrence.name)
      ) {
        return [{ ...occurrence, ownerKind: "alias" }];
      }
      return [];
    }),
  ];
}

function publicState(state) {
  return { kind: state.kind, selector: state.selector };
}

function selectorCondition(atRules) {
  const conditions = atRules
    .filter((atRule) => atRule.name !== "layer")
    .map((atRule) => ({
      kind:
        atRule.name === "media" &&
        /forced-colors\s*:\s*active/i.test(atRule.query)
          ? "forced-colors"
          : atRule.name,
      name: atRule.name,
      query: atRule.query,
    }));

  return {
    kind:
      conditions.length === 0
        ? "normal"
        : conditions.length === 1
          ? conditions[0].kind
          : "compound",
    atRules: conditions,
  };
}

function selectorConditionKey(condition) {
  return JSON.stringify(
    condition.atRules.map(({ kind, name, query }) => [kind, name, query]),
  );
}

function getQualifiedHosts(records, pattern) {
  if (pattern.qualifiedHosts.length > 0) {
    return [...new Set(pattern.qualifiedHosts.map(normalizeSelector))].sort();
  }
  const canonicalElements = new Set(
    inspectSelector(pattern.canonicalSelector).elements,
  );
  return [
    ...new Set(
      [
        ...records.flatMap((record) =>
          patternOccurrences(record, pattern).flatMap((occurrence) => {
            if (occurrence.ownerKind !== "canonical") return [];
            const constraints =
              record.compounds[occurrence.compoundIndex]?.hostConstraints ?? [];
            const filtered = constraints.filter(
              (constraint) => !canonicalElements.has(constraint),
            );
            return filtered.length > 0 ? [filtered.join("")] : [];
          }),
        ),
      ].map((host) => normalizeSelector(host)),
    ),
  ].sort();
}

function getPatternStates(records, pattern) {
  return uniqueBy(
    records.flatMap((record) => {
      const compoundIndexes = new Set(
        patternOccurrences(record, pattern).map(
          (occurrence) => occurrence.compoundIndex,
        ),
      );
      return record.states
        .filter((state) => compoundIndexes.has(state.compoundIndex))
        .map((state) => ({ ...publicState(state), source: record.source }));
    }),
    (state) => `${state.kind}:${state.selector}`,
  );
}

function getSelectorSuffix(record, compoundIndex) {
  return record.compounds
    .slice(compoundIndex + 1)
    .map((compound, index) => {
      if (index === 0 && compound.combinatorBefore === " ") {
        return compound.selector;
      }
      return `${compound.combinatorBefore ?? " "} ${compound.selector}`;
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPatternSlots(pattern, records, patternNames) {
  return pattern.slots.map((slot) => {
    const inspection = inspectSelector(
      /^(?:[>+~]|\|\|)/.test(slot.selector)
        ? `:scope ${slot.selector}`
        : slot.selector,
    );
    const slotPattern = [...inspection.classNames].find((className) =>
      patternNames.has(className),
    );
    return { ...slot, pattern: slotPattern ?? null };
  });
}

function getPatternInternalCandidates(pattern, records) {
  const publicSelectors = new Set([
    ...pattern.slots.map((slot) => slot.selector.replace(/\s+/g, "")),
    ...pattern.modifierContracts.map((contract) =>
      contract.selector.replace(/\s+/g, ""),
    ),
    ...pattern.stateContracts.flatMap((contract) => [
      ...contract.selectors.map((selector) =>
        selector.selector.replace(/\s+/g, ""),
      ),
      ...contract.aliases.map((alias) => alias.selector.replace(/\s+/g, "")),
    ]),
  ]);
  return uniqueBy(
    records.flatMap((record) =>
      patternOccurrences(record, pattern).flatMap((occurrence) => {
        const selector = getSelectorSuffix(record, occurrence.compoundIndex);
        if (!selector || publicSelectors.has(selector.replace(/\s+/g, ""))) {
          return [];
        }
        return [
          {
            selector,
            kind: "internal-candidate",
            public: false,
            source: record.source,
          },
        ];
      }),
    ),
    (candidate) => candidate.selector.replace(/\s+/g, ""),
  );
}

function renderCompounds(compounds) {
  return compounds
    .map((compound, index) => {
      if (index === 0) return compound.selector;
      return `${compound.combinatorBefore ?? " "}${compound.selector}`;
    })
    .join("");
}

function selectorRequirementsMatch(
  expected,
  actual,
  { allowTrailingCompounds = false, ignoreOwner = false } = {},
) {
  if (
    allowTrailingCompounds
      ? expected.compounds.length > actual.compounds.length
      : expected.compounds.length !== actual.compounds.length
  ) {
    return false;
  }

  for (let index = 0; index < expected.compounds.length; index++) {
    const expectedCompound = expected.compounds[index];
    const actualCompound = actual.compounds[index];
    if (
      index > 0 &&
      expectedCompound.combinatorBefore !== actualCompound.combinatorBefore
    ) {
      return false;
    }

    const actualClasses = new Set(
      actual.classOccurrences
        .filter((occurrence) => occurrence.compoundIndex === index)
        .map((occurrence) => occurrence.name),
    );
    const actualElements = new Set(
      actual.elementOccurrences
        .filter((occurrence) => occurrence.compoundIndex === index)
        .map((occurrence) => occurrence.name),
    );
    const actualStates = new Set(
      actual.states
        .filter((state) => state.compoundIndex === index)
        .map((state) => state.selector),
    );
    const actualHosts = new Set(actualCompound.hostConstraints);

    const expectedClasses = expected.classOccurrences
      .filter((occurrence) => occurrence.compoundIndex === index)
      .map((occurrence) => occurrence.name)
      .filter((name) => !(ignoreOwner && index === 0 && name === "owner"));
    const expectedElements = expected.elementOccurrences
      .filter((occurrence) => occurrence.compoundIndex === index)
      .map((occurrence) => occurrence.name);
    const expectedStates = expected.states
      .filter((state) => state.compoundIndex === index)
      .map((state) => state.selector);

    if (!expectedClasses.every((name) => actualClasses.has(name))) return false;
    if (!expectedElements.every((name) => actualElements.has(name))) return false;
    if (!expectedStates.every((state) => actualStates.has(state))) return false;
    if (
      !expectedCompound.hostConstraints.every((host) => actualHosts.has(host))
    ) {
      return false;
    }
  }

  return true;
}

function relationSelectorInspection(selector) {
  const expanded = selector.includes("&")
    ? selector.replaceAll("&", ".owner")
    : /^(?:[>+~]|\|\|)/.test(selector)
      ? `.owner${selector}`
      : `.owner ${selector}`;
  return inspectSelector(expanded);
}

function relationMatchesRecord(
  pattern,
  selector,
  record,
  occurrence = null,
  { allowTrailingCompounds = true } = {},
) {
  const expected = relationSelectorInspection(selector);
  const ownerOccurrences = occurrence
    ? [occurrence]
    : patternOccurrences(record, pattern);

  return ownerOccurrences.some((ownerOccurrence) => {
    const actualCompounds = record.compounds.slice(ownerOccurrence.compoundIndex);
    const actual = inspectSelector(renderCompounds(actualCompounds));
    return selectorRequirementsMatch(expected, actual, {
      allowTrailingCompounds,
      ignoreOwner: true,
    });
  });
}

function identityMatchesOccurrence(pattern, record, occurrence) {
  const selector =
    occurrence.ownerKind === "alias"
      ? pattern.aliases.find((alias) =>
          alias.kind === "class"
            ? alias.name === occurrence.name
            : inspectSelector(alias.canonicalSelector).elements.has(
                occurrence.name,
              ),
        )?.canonicalSelector
      : pattern.canonicalSelector;
  if (!selector) return false;

  const expected = inspectSelector(selector);
  if (expected.compounds.length !== 1) return false;
  const actual = inspectSelector(record.compounds[occurrence.compoundIndex].selector);
  return selectorRequirementsMatch(expected, actual);
}

function explicitRelations(surfacePatterns) {
  const relations = [];
  for (const pattern of surfacePatterns) {
    for (const alias of pattern.aliases.filter(
      (candidate) => candidate.kind === "class",
    )) {
      relations.push({
        name: alias.name,
        kind: "alias",
        owner: pattern.name,
        selector: alias.canonicalSelector,
        source: alias.source,
        lifecycle: alias.lifecycle,
        deprecated: alias.deprecated,
      });
    }
    for (const modifier of pattern.modifierContracts) {
      relations.push(modifier);
    }
    for (const state of pattern.stateContracts) {
      for (const selector of state.selectors) {
        relations.push({
          ...selector,
          name: state.name,
          kind: "state",
          owner: pattern.name,
          state: state.name,
          alias: false,
        });
      }
      for (const alias of state.aliases) {
        relations.push({
          ...alias,
          name: state.name,
          kind: "state",
          owner: pattern.name,
          state: state.name,
          alias: true,
        });
      }
    }
    for (const slot of pattern.slots) {
      relations.push({
        ...slot,
        name: slot.name ?? slot.selector,
        owner: pattern.name,
        kind: "slot",
      });
    }
  }
  return uniqueBy(
    relations,
    (relation) =>
      `${relation.name}:${relation.kind}:${relation.owner}:${relation.selector}:${relation.alias === true}`,
  );
}

function sourceEvidenceKey(source) {
  return `${source.file}:${source.line ?? source.annotationLine ?? ""}:${source.column ?? ""}:${source.endLine ?? ""}`;
}

function relationEvidenceKey(relation) {
  return `${relation.kind}:${relation.owner ?? ""}:${relation.name}:${relation.selector}:${relation.state ?? ""}:${relation.alias === true}`;
}

function mergeRelationEvidence(relations) {
  const merged = new Map();
  for (const relation of relations) {
    const key = relationEvidenceKey(relation);
    const current = merged.get(key);
    if (!current) {
      merged.set(key, {
        ...relation,
        sources: uniqueBy(relation.sources ?? [], sourceEvidenceKey),
      });
      continue;
    }
    current.sources = uniqueBy(
      [...current.sources, ...(relation.sources ?? [])],
      sourceEvidenceKey,
    );
  }
  return [...merged.values()];
}

function relationClassNames(relation, pattern) {
  if (relation.kind !== "state") return relation.classes ?? [];
  if (relation.classes?.includes(relation.state)) return [relation.state];

  const slotClasses = new Set(pattern.slots.flatMap((slot) => slot.classes));
  return (relation.classes ?? []).filter((name) => !slotClasses.has(name));
}

function selectorContractKind(relations) {
  const kinds = new Set(relations.map((relation) => relation.kind));
  if (kinds.has("unexplained")) return "unexplained";
  if (kinds.has("state")) return "state";
  if (kinds.has("modifier")) return "modifier";
  if (kinds.has("slot")) return "slot";
  if (kinds.has("alias")) return "alias";
  if (kinds.has("internal")) return "internal";
  if (kinds.has("qualified-host")) return "qualified-host";
  return "canonical";
}

function buildOwnerUsageGraph(surfacePatterns, selectorRecords) {
  const patternByName = new Map(
    surfacePatterns.map((pattern) => [pattern.name, pattern]),
  );
  const definitions = explicitRelations(surfacePatterns);
  const definitionsByOwner = new Map();
  const definitionsByClass = new Map();
  for (const definition of definitions) {
    const ownerDefinitions = definitionsByOwner.get(definition.owner) ?? [];
    ownerDefinitions.push(definition);
    definitionsByOwner.set(definition.owner, ownerDefinitions);
    for (const className of definition.classes ?? []) {
      const classDefinitions = definitionsByClass.get(className) ?? [];
      classDefinitions.push(definition);
      definitionsByClass.set(className, classDefinitions);
    }
  }

  const canonicalClassNames = new Set(
    surfacePatterns.flatMap((pattern) => [
      ...inspectSelector(pattern.canonicalSelector).classNames,
      ...pattern.aliases
        .filter((alias) => alias.kind === "class")
        .map((alias) => alias.name),
    ]),
  );
  const relationsByRecord = new Map();
  const ownersByRecord = new Map();
  const recordsByPattern = new Map(
    surfacePatterns.map((pattern) => [pattern.name, []]),
  );
  const classRelations = new Map();

  const addClassRelation = (className, relation) => {
    const current = classRelations.get(className) ?? [];
    current.push(relation);
    classRelations.set(className, current);
  };
  const addRecordRelation = (record, relation, classNames = []) => {
    const usage = {
      ...relation,
      sources: [record.source],
    };
    const current = relationsByRecord.get(record) ?? [];
    current.push(usage);
    relationsByRecord.set(record, current);
    for (const className of classNames) addClassRelation(className, usage);
  };

  for (const record of selectorRecords) {
    const ownerContexts = surfacePatterns.flatMap((pattern) => {
      const occurrences = patternOccurrences(record, pattern);
      return occurrences.length > 0 ? [{ pattern, occurrences }] : [];
    });
    ownersByRecord.set(
      record,
      new Set(ownerContexts.map(({ pattern }) => pattern.name)),
    );
    for (const { pattern } of ownerContexts) {
      recordsByPattern.get(pattern.name).push(record);
    }

    const matchedClassesByOwner = new Map();
    const matchedClassesInRecord = new Set();
    for (const { pattern, occurrences } of ownerContexts) {
      const matchedClasses = new Set();
      matchedClassesByOwner.set(pattern.name, matchedClasses);

      for (const occurrence of occurrences) {
        if (
          occurrence.compoundIndex !== record.compounds.length - 1 ||
          !identityMatchesOccurrence(pattern, record, occurrence)
        ) {
          continue;
        }
        const isAlias = occurrence.ownerKind === "alias";
        const identityRelation = {
          name: isAlias ? occurrence.name : pattern.name,
          kind: isAlias ? "alias" : "canonical",
          owner: pattern.name,
          selector: isAlias
            ? pattern.aliases.find(
                (alias) =>
                  alias.kind === "class" && alias.name === occurrence.name,
              )?.canonicalSelector ?? occurrence.name
            : pattern.canonicalSelector,
          source: isAlias
            ? pattern.aliases.find(
                (alias) =>
                  alias.kind === "class" && alias.name === occurrence.name,
              )?.source ?? pattern.source
            : pattern.source,
        };
        const classNames = record.classOccurrences
          .filter(
            (candidate) =>
              candidate.compoundIndex === occurrence.compoundIndex &&
              candidate.name === occurrence.name,
          )
          .map((candidate) => candidate.name);
        addRecordRelation(record, identityRelation, classNames);
        classNames.forEach((name) => {
          matchedClasses.add(name);
          matchedClassesInRecord.add(name);
        });

        if (!isAlias && pattern.qualifiedHosts.length > 0) {
          for (const host of pattern.qualifiedHosts) {
            const hostInspection = inspectSelector(host);
            const actualInspection = inspectSelector(
              record.compounds[occurrence.compoundIndex].selector,
            );
            if (!selectorRequirementsMatch(hostInspection, actualInspection)) {
              continue;
            }
            addRecordRelation(
              record,
              {
                name: pattern.name,
                kind: "qualified-host",
                owner: pattern.name,
                selector: normalizeSelector(host),
                source: pattern.source,
              },
              classNames,
            );
          }
        }
      }

      for (const definition of definitionsByOwner.get(pattern.name) ?? []) {
        if (definition.kind === "alias") continue;
        if (!relationMatchesRecord(pattern, definition.selector, record)) {
          continue;
        }
        const classNames = relationClassNames(definition, pattern);
        addRecordRelation(record, definition, classNames);
        classNames.forEach((name) => {
          matchedClasses.add(name);
          matchedClassesInRecord.add(name);
        });
      }
    }

    for (const { pattern, occurrences } of ownerContexts) {
      const matchedClasses = matchedClassesByOwner.get(pattern.name);
      for (const occurrence of occurrences) {
        const scopedClasses = record.classOccurrences.filter(
          (candidate) =>
            candidate.relation !== "relative" &&
            candidate.compoundIndex >= occurrence.compoundIndex &&
            !(
              candidate.compoundIndex === occurrence.compoundIndex &&
              candidate.name === occurrence.name
            ),
        );
        for (const candidate of scopedClasses) {
          if (matchedClasses.has(candidate.name)) continue;
          const isKnownIdentity = canonicalClassNames.has(candidate.name);
          const hasOtherMatchedOwner = matchedClassesInRecord.has(candidate.name);
          const kind =
            !isKnownIdentity &&
            !hasOtherMatchedOwner &&
            candidate.compoundIndex === occurrence.compoundIndex
              ? "unexplained"
              : "internal";
          addRecordRelation(
            record,
            {
              name: candidate.name,
              kind,
              owner: pattern.name,
              selector: `.${candidate.name}`,
              source: record.source,
            },
            [candidate.name],
          );
        }

        const suffix = getSelectorSuffix(record, occurrence.compoundIndex);
        if (!suffix) continue;
        const hasCoveringRelation = (definitionsByOwner.get(pattern.name) ?? [])
          .filter((definition) => definition.kind !== "alias")
          .some((definition) =>
            relationMatchesRecord(
              pattern,
              definition.selector,
              record,
              occurrence,
              { allowTrailingCompounds: false },
            ),
          );
        if (!hasCoveringRelation) {
          addRecordRelation(record, {
            name: suffix,
            kind: "internal",
            owner: pattern.name,
            selector: suffix,
            source: record.source,
          });
        }
      }
    }

    if (ownerContexts.length === 0) {
      for (const className of record.classNames) {
        addRecordRelation(
          record,
          {
            name: className,
            kind: "internal",
            owner: null,
            selector: `.${className}`,
            source: record.source,
          },
          [className],
        );
      }
    }

    relationsByRecord.set(
      record,
      mergeRelationEvidence(relationsByRecord.get(record) ?? []),
    );
  }

  for (const [className, relations] of classRelations) {
    classRelations.set(className, mergeRelationEvidence(relations));
  }
  for (const [patternName, records] of recordsByPattern) {
    recordsByPattern.set(patternName, uniqueBy(records, (record) => record));
  }

  return {
    classRelations,
    definitions,
    ownersByRecord,
    patternByName,
    recordsByPattern,
    relationsByRecord,
  };
}

function contextualizeComponentTokens(
  registry,
  selectorRecords,
  ownersByRecord,
) {
  const recordsByToken = new Map();
  for (const record of selectorRecords) {
    for (const declaration of record.declarations) {
      if (declaration.property.startsWith("--")) {
        const current = recordsByToken.get(declaration.property) ?? [];
        current.push({ declaration, kind: "declaration", record, value: declaration.value });
        recordsByToken.set(declaration.property, current);
      }
      for (const reference of declaration.references) {
        const current = recordsByToken.get(reference.name) ?? [];
        current.push({
          declaration,
          kind: "fallback",
          record,
          value: reference.fallback,
        });
        recordsByToken.set(reference.name, current);
      }
    }
  }

  for (const token of registry.tokenInventory) {
    const usages = recordsByToken.get(token.name) ?? [];
    token.sources = uniqueBy(
      usages.map(({ declaration }) => declaration.source),
      sourceEvidenceKey,
    );
    if (token.tier !== "component-contract") continue;

    const owners = new Set();
    const defaultsByKey = new Map();
    const addDefault = (candidate) => {
      const key = `${candidate.owner ?? ""}:${candidate.kind}:${candidate.selector ?? ""}:${selectorConditionKey(candidate.condition)}:${candidate.value}`;
      const current = defaultsByKey.get(key);
      if (!current) {
        defaultsByKey.set(key, candidate);
        return;
      }
      current.sources = uniqueBy(
        [...current.sources, ...candidate.sources],
        sourceEvidenceKey,
      );
    };

    for (const usage of usages) {
      const recordOwners = [...(ownersByRecord.get(usage.record) ?? [])];
      recordOwners.forEach((owner) => owners.add(owner));
      if (usage.value === null) continue;
      const scopedOwners = recordOwners.length > 0 ? recordOwners : [null];
      for (const owner of scopedOwners) {
        addDefault({
          owner,
          value: usage.value,
          kind: usage.kind,
          selector: usage.record.selector,
          condition: selectorCondition(usage.record.atRules),
          source: usage.declaration.source,
          sources: [usage.declaration.source],
        });
      }
    }
    if (token.registration?.initialValue !== null && token.registration) {
      addDefault({
        owner: null,
        value: token.registration.initialValue,
        kind: "registration",
        selector: null,
        condition: selectorCondition([]),
        source: token.registration.source,
        sources: [token.registration.source],
      });
    }

    token.owners = [...owners].sort();
    token.defaults = [...defaultsByKey.values()].sort(
      (a, b) =>
        String(a.owner).localeCompare(String(b.owner)) ||
        String(a.selector).localeCompare(String(b.selector)) ||
        a.value.localeCompare(b.value),
    );
    const values = [...new Set(token.defaults.map((entry) => entry.value))];
    if (values.length === 1) token.default = values[0];
    else if (values.length === 0) token.default = null;
    else delete token.default;
  }

  const surfacePatterns = [
    ...registry.patterns,
    ...registry.patternGroupMembers,
  ];
  for (const pattern of surfacePatterns) {
    pattern.componentTokens = registry.tokenInventory
      .filter(
        (token) =>
          token.public &&
          token.tier === "component-contract" &&
          token.owners.includes(pattern.name),
      )
      .map((token) => {
        const defaults = token.defaults.filter(
          (candidate) => candidate.owner === pattern.name,
        );
        const values = [...new Set(defaults.map((entry) => entry.value))];
        const contract = {
          name: token.name,
          tier: token.tier,
          defaultStability: token.defaultStability,
          defaults,
          source: defaults[0]?.source ?? token.source,
          sources: uniqueBy(
            defaults.flatMap((entry) => entry.sources),
            sourceEvidenceKey,
          ),
        };
        if (values.length === 1) contract.default = values[0];
        else if (values.length === 0) contract.default = null;
        return contract;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

function buildCssSurface(registry, selectorRecords, bundles) {
  const surfacePatterns = [
    ...registry.patterns,
    ...registry.patternGroupMembers,
  ];
  const patternNames = new Set(
    surfacePatterns.map((pattern) => pattern.name),
  );
  const groupByMember = new Map(
    registry.patternGroups.flatMap((group) =>
      group.members.map((member) => [member, group]),
    ),
  );
  const aliasOwners = new Map();
  for (const pattern of surfacePatterns) {
    for (const alias of pattern.aliases) {
      if (alias.kind === "class") aliasOwners.set(alias.name, pattern.name);
    }
  }

  const usageGraph = buildOwnerUsageGraph(surfacePatterns, selectorRecords);
  for (const pattern of surfacePatterns) {
    const records = usageGraph.recordsByPattern.get(pattern.name) ?? [];
    pattern.aliases = uniqueBy(
      pattern.aliases,
      (alias) => `${alias.kind}:${alias.canonicalSelector}`,
    );
    pattern.qualifiedHosts = getQualifiedHosts(records, pattern);
    pattern.states = getPatternStates(records, pattern);
    pattern.slots = getPatternSlots(pattern, records, patternNames);
    pattern.internalCandidates = getPatternInternalCandidates(pattern, records);
    const conditions = records.flatMap((record) =>
      record.atRules.map((atRule) => ({ ...atRule, source: record.source })),
    );
    pattern.breakpoints = uniqueBy(
      conditions.filter(
        (condition) =>
          condition.name === "media" && /(?:width|height)/.test(condition.query),
      ),
      (condition) => condition.query,
    );
    pattern.containerQueries = uniqueBy(
      conditions.filter((condition) => condition.name === "container"),
      (condition) => condition.query,
    );
    pattern.requirements = [
      ...new Set(records.flatMap((record) => record.features)),
    ].sort();
    pattern.bundleMembership = bundlesForLayer(pattern.layer, bundles);
    pattern.sources = uniqueBy(
      records.map((record) => record.source),
      sourceEvidenceKey,
    );
    pattern.source = {
      ...pattern.source,
      selectors: records.map((record) => ({
        selector: record.selector,
        line: record.source.line,
        column: record.source.column,
      })),
    };
  }

  contextualizeComponentTokens(
    registry,
    selectorRecords,
    usageGraph.ownersByRecord,
  );

  const patternByClass = new Map(
    surfacePatterns.flatMap((pattern) =>
      [...inspectSelector(pattern.canonicalSelector).classNames].map((name) => [
        name,
        pattern,
      ]),
    ),
  );
  const allClassNames = [
    ...new Set([
      ...selectorRecords.flatMap((record) => record.classNames),
      ...aliasOwners.keys(),
      ...usageGraph.definitions.flatMap((relation) => relation.classes ?? []),
    ]),
  ].sort();
  const classContracts = allClassNames.map((name) => {
    const records = selectorRecords.filter((record) =>
      record.classNames.includes(name),
    );
    const directPattern = patternByClass.get(name);
    const group = groupByMember.get(name);
    const aliasOwner = aliasOwners.get(name);
    const aliasPattern = aliasOwner
      ? usageGraph.patternByName.get(aliasOwner)
      : null;
    const relations = usageGraph.classRelations.get(name) ?? [];
    const publicRelations = relations.filter(
      (relation) => relation.kind !== "internal",
    );
    const relationKinds = new Set(
      publicRelations.map((relation) => relation.kind),
    );
    const kind = directPattern
      ? directPattern.kind
      : group
        ? "pattern-group-member"
        : aliasOwner
          ? "alias"
          : relationKinds.has("unexplained")
            ? "unexplained"
            : relationKinds.size === 1
              ? [...relationKinds][0]
              : relationKinds.size > 1
                ? "relation"
                : "internal-candidate";
    const isPublic = Boolean(
      directPattern || group || aliasOwner || publicRelations.length > 0,
    );
    const contractOwners = [
      ...new Set(relations.map((relation) => relation.owner).filter(Boolean)),
    ].sort();
    const sources = uniqueBy(
      records.map((record) => record.source),
      sourceEvidenceKey,
    );
    const contractStates = uniqueBy(
      records.flatMap((record) => {
        const compoundIndexes = new Set(
          record.classOccurrences
            .filter((occurrence) => occurrence.name === name)
            .map((occurrence) => occurrence.compoundIndex),
        );
        return record.states
          .filter((state) => compoundIndexes.has(state.compoundIndex))
          .map(publicState);
      }),
      (state) => `${state.kind}:${state.selector}`,
    );

    return {
      name,
      kind,
      public: isPublic,
      role: directPattern?.role
        ? directPattern.role
        : group?.role
          ? group.role
          : aliasOwner
            ? `Compatibility alias for .${aliasOwner}`
            : contractOwners.length > 0
              ? `${isPublic ? "Explicit" : "Internal"} ${kind} contract for ${contractOwners.map((owner) => (owner.startsWith(".") ? owner : `.${owner}`)).join(", ")}`
              : "Internal selector candidate inferred from CSS evidence",
      canonicalSelector: `.${name}`,
      owners: contractOwners,
      relations,
      group: group?.name ?? null,
      layer:
        directPattern?.layer ??
        aliasPattern?.layer ??
        records[0]?.layer ??
        null,
      states: contractStates,
      bundleMembership: [
        ...new Set(
          records.flatMap((record) => bundlesForLayer(record.layer, bundles)),
        ),
      ].sort(),
      selectors: records.map((record) => ({
        selector: record.selector,
        source: record.source,
      })),
      since: directPattern?.since ?? group?.since ?? null,
      deprecated:
        directPattern?.deprecated ??
        aliasPattern?.aliases.find((alias) => alias.name === name)
          ?.deprecated ??
        null,
      lifecycle:
        directPattern?.lifecycle ??
        aliasPattern?.aliases.find((alias) => alias.name === name)?.lifecycle ??
        null,
      source:
        directPattern?.source ??
        aliasPattern?.source ??
        group?.source ??
        sources[0] ?? { file: registry.sourceFile, line: null },
      sources,
    };
  });

  const selectorContractsByKey = new Map();
  for (const record of selectorRecords) {
    const relations = usageGraph.relationsByRecord.get(record) ?? [];
    const owners = [
      ...new Set(relations.map((relation) => relation.owner).filter(Boolean)),
    ].sort();
    if (record.classNames.length === 0 && owners.length === 0) continue;
    const kind = selectorContractKind(relations);
    const condition = selectorCondition(record.atRules);
    const contract = {
      kind,
      public: kind !== "internal",
      canonicalSelector: record.selector,
      layer: record.layer,
      layers: [record.layer],
      owners,
      classes: record.classNames,
      relations,
      internalCandidates: [
        ...new Set(
          relations
            .filter((relation) => relation.kind === "internal")
            .map((relation) => relation.name),
        ),
      ].sort(),
      ownerMismatches: [
        ...new Set(
          relations
            .filter((relation) => relation.kind === "unexplained")
            .map((relation) => relation.name),
        ),
      ].sort(),
      states: record.states.map(publicState),
      conditions: record.atRules.filter((atRule) => atRule.name !== "layer"),
      condition,
      requirements: record.features,
      bundleMembership: bundlesForLayer(record.layer, bundles),
      source: record.source,
      sources: [record.source],
    };
    const key = `${record.selector}\0${selectorConditionKey(condition)}`;
    const existing = selectorContractsByKey.get(key);
    if (!existing) {
      selectorContractsByKey.set(key, contract);
      continue;
    }

    existing.layers = [
      ...new Set([...existing.layers, ...contract.layers]),
    ].sort((a, b) => String(a).localeCompare(String(b)));
    existing.owners = [
      ...new Set([...existing.owners, ...contract.owners]),
    ].sort();
    existing.classes = [
      ...new Set([...existing.classes, ...contract.classes]),
    ].sort();
    existing.states = uniqueBy(
      [...existing.states, ...contract.states],
      (state) => `${state.kind}:${state.selector}`,
    );
    existing.relations = mergeRelationEvidence([
      ...existing.relations,
      ...contract.relations,
    ]);
    existing.kind = selectorContractKind(existing.relations);
    existing.public = existing.kind !== "internal";
    existing.internalCandidates = [
      ...new Set([
        ...existing.internalCandidates,
        ...contract.internalCandidates,
      ]),
    ].sort();
    existing.ownerMismatches = [
      ...new Set([...existing.ownerMismatches, ...contract.ownerMismatches]),
    ].sort();
    existing.requirements = [
      ...new Set([...existing.requirements, ...contract.requirements]),
    ].sort();
    existing.bundleMembership = [
      ...new Set([...existing.bundleMembership, ...contract.bundleMembership]),
    ].sort();
    existing.sources = uniqueBy(
      [...existing.sources, ...contract.sources],
      sourceEvidenceKey,
    );
  }
  const selectorContracts = [...selectorContractsByKey.values()];

  const elementNames = [
    ...new Set(selectorRecords.flatMap((record) => record.elements)),
  ].sort();
  const elements = elementNames.map((name) => {
    const records = selectorRecords.filter((record) =>
      record.elements.includes(name),
    );
    const sources = uniqueBy(
      records.map((record) => record.source),
      sourceEvidenceKey,
    );
    return {
      name,
      kind: "element",
      public: true,
      canonicalSelector: name,
      layers: [...new Set(records.map((record) => record.layer))].sort(),
      states: uniqueBy(
        records.flatMap((record) => record.states.map(publicState)),
        (state) => `${state.kind}:${state.selector}`,
      ),
      bundleMembership: [
        ...new Set(
          records.flatMap((record) => bundlesForLayer(record.layer, bundles)),
        ),
      ].sort(),
      source: sources,
      sources,
    };
  });

  const publicClassContracts = classContracts.filter(
    (contract) => contract.public,
  );
  const unexplainedClasses = publicClassContracts
    .filter((contract) =>
      contract.relations.some((relation) => relation.kind === "unexplained"),
    )
    .map((contract) => contract.name);
  const publicSelectorContracts = selectorContracts.filter(
    (contract) => contract.public,
  );
  const unexplainedRelations = selectorContracts.flatMap((contract) =>
    contract.relations
      .filter((relation) => relation.kind === "unexplained")
      .map((relation) => ({
        canonicalSelector: contract.canonicalSelector,
        condition: contract.condition,
        owner: relation.owner,
        name: relation.name,
        kind: relation.kind,
        selector: relation.selector,
        source: contract.source,
        sources: contract.sources,
      })),
  );
  const selectorRelations = uniqueBy(
    selectorContracts.flatMap((contract) =>
      contract.relations.map((relation) => ({
        canonicalSelector: contract.canonicalSelector,
        condition: contract.condition,
        relation,
      })),
    ),
    (contract) =>
      `${contract.canonicalSelector}:${selectorConditionKey(contract.condition)}:${relationEvidenceKey(contract.relation)}`,
  );
  const publicSelectorRelations = selectorRelations.filter(
    ({ relation }) => relation.kind !== "internal",
  );
  const unexplainedSelectors = [
    ...new Set(
      unexplainedRelations.map((relation) => relation.canonicalSelector),
    ),
  ];

  return {
    classContracts,
    elements,
    selectorContracts,
    coverage: {
      publicClassNames: publicClassContracts.length,
      explainedClassNames:
        publicClassContracts.length - unexplainedClasses.length,
      unexplainedClassNames: unexplainedClasses,
      internalClassCandidates: classContracts
        .filter((contract) => !contract.public)
        .map((contract) => contract.name),
      publicSelectors: publicSelectorContracts.length,
      explainedSelectors:
        publicSelectorContracts.length - unexplainedSelectors.length,
      unexplainedSelectors,
      internalSelectorCandidates: [
        ...new Set(
          selectorContracts
            .filter((contract) => !contract.public)
            .map((contract) => contract.canonicalSelector),
        ),
      ],
      selectorRelations: selectorRelations.length,
      publicSelectorRelations: publicSelectorRelations.length,
      explainedSelectorRelations:
        publicSelectorRelations.length - unexplainedRelations.length,
      unexplainedRelations,
    },
  };
}

function validateOwnerRelations(registry, selectorRecords, violations) {
  const surfacePatterns = [
    ...registry.patterns,
    ...registry.patternGroupMembers,
  ];
  for (const pattern of surfacePatterns) {
    const ownerRecords = selectorRecords.filter(
      (record) => patternOccurrences(record, pattern).length > 0,
    );
    const validateRelation = (label, selector, source) => {
      if (
        ownerRecords.some((record) =>
          relationMatchesRecord(pattern, selector, record),
        )
      ) {
        return;
      }
      violations.push({
        file: source.file,
        line: source.annotationLine ?? 1,
        message: `${label} ${JSON.stringify(selector)} has no selector evidence owned by ${pattern.name}`,
        rule: "owner-relation-evidence",
      });
    };

    for (const modifier of pattern.modifierContracts) {
      validateRelation(
        `Modifier ${modifier.name} on`,
        modifier.selector,
        modifier.source,
      );
    }
    for (const state of pattern.stateContracts) {
      for (const selector of state.selectors) {
        validateRelation(
          `State ${state.name} on`,
          selector.selector,
          selector.source,
        );
      }
      for (const alias of state.aliases) {
        validateRelation(
          `State alias ${state.name} on`,
          alias.selector,
          alias.source,
        );
      }
    }
    for (const alias of pattern.aliases) {
      const hasAliasEvidence = ownerRecords.some((record) =>
        patternOccurrences(record, pattern).some(
          (occurrence) =>
            occurrence.ownerKind === "alias" &&
            (alias.kind === "class"
              ? occurrence.name === alias.name
              : inspectSelector(alias.canonicalSelector).elements.has(
                  occurrence.name,
                )),
        ),
      );
      if (hasAliasEvidence) continue;
      violations.push({
        file: alias.source.file,
        line: alias.source.annotationLine ?? 1,
        message: `Alias ${alias.canonicalSelector} has no selector evidence owned by ${pattern.name}`,
        rule: "owner-relation-evidence",
      });
    }
  }
}

function buildRegistry(
  blocks,
  sourcePath,
  tokenInventory,
  tokenClassification,
  selectorRecords,
  externalContracts,
) {
  const registry = {
    schemaVersion: 2,
    sourceFile: sourcePath,
    tokenContract: {
      privatePrefix: PRIVATE_TOKEN_PREFIX,
      tiers: {
        "primitive-reference":
          "Public raw values and reference scales used to construct semantic decisions",
        "global-semantic":
          "Public purpose-bound roles shared across components and themes",
        "component-contract":
          "Public override surface owned by a component, utility, or layout pattern",
        "private-calculated":
          "Framework implementation detail; never set, consume, or document as a consumer override",
      },
    },
    patterns: [],
    patternGroups: [],
    tokens: [],
    tokenGroups: [],
    tokenSets: tokenClassification.tokenSets.map((tokenSet) => ({
      ...tokenSet,
      source: { file: sourcePath, annotationLine: tokenSet.source.line },
    })),
    tokenInventory: [],
    patternGroupMembers: [],
    layers: externalContracts.layers ?? [],
    bundles: externalContracts.bundles ?? [],
    features: externalContracts.features ?? [],
    themes: externalContracts.themes ?? [],
    packageExports: externalContracts.packageExports ?? [],
    commands: externalContracts.commands ?? [],
    documentationReferences: [],
  };

  const baseEntry = (annotation, targets) => {
    const tags = annotation.tags;
    const entrySourcePath = annotation.sourcePath ?? sourcePath;
    return {
      role: tags.get("role")?.trim() ?? "",
      since: tags.get("since")?.trim() ?? null,
      deprecated: tags.get("deprecated")?.trim() ?? null,
      lifecycle: parseLifecycle(tags.get("lifecycle")) ?? {
        status: tags.has("deprecated") ? "deprecated" : "active",
        since: null,
        removalVersion: null,
        replacement: null,
        reason: tags.get("deprecated")?.trim() ?? null,
      },
      source: {
        file: entrySourcePath,
        annotationLine: annotation.line,
      },
    };
  };

  for (const b of blocks) {
    const { kind, tags } = b.annotation;
    const base = baseEntry(b.annotation, b.targets);

    if (kind === "pattern") {
      const target = b.targets.find((t) => t.type === "pattern");
      const entrySourcePath = b.annotation.sourcePath ?? sourcePath;
      const owner = tags.get("pattern")?.trim();
      const modifiers = tags.get("modifiers")
        ? tags
            .get("modifiers")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const related = tags.get("related")
        ? tags
            .get("related")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const relationSource = {
        file: entrySourcePath,
        annotationLine: b.annotation.line,
      };
      const aliasDeprecations = parseAliasDeprecations(
        tags.get("alias-deprecated"),
      );
      const aliasLifecycles = parseAliasLifecycles(tags.get("alias-lifecycle"));
      registry.patterns.push({
        name: owner,
        kind: "pattern",
        ...base,
        canonicalSelector: normalizeSelector(
          tags.get("selector")?.trim() ?? `.${owner}`,
        ),
        declaredSelector: target?.selector ?? null,
        layer: target?.layer ?? null,
        example: tags.get("example")?.trim() ?? "",
        modifiers,
        modifierContracts: buildModifierContracts(tags, owner, relationSource),
        stateContracts: buildStateContracts(tags, owner, relationSource),
        aliases: [
          ...parseList(tags.get("aliases")).map((name) => ({
            name: name.replace(/^\./, ""),
            kind: "class",
            canonicalSelector: name.startsWith(".") ? name : `.${name}`,
            deprecated: aliasDeprecations.get(name.replace(/^\./, "")) ?? null,
            lifecycle:
              aliasLifecycles.get(name.replace(/^\./, "")) ??
              (aliasDeprecations.has(name.replace(/^\./, ""))
                ? {
                    status: "deprecated",
                    since: null,
                    removalVersion: null,
                    replacement: null,
                    reason: aliasDeprecations.get(name.replace(/^\./, "")),
                  }
                : {
                    status: "active",
                    since: null,
                    removalVersion: null,
                    replacement: null,
                    reason: null,
                  }),
            source: relationSource,
          })),
          ...parseList(tags.get("selector-aliases")).map((selector) => ({
            name: selector,
            kind: "selector",
            canonicalSelector: normalizeSelector(selector),
            deprecated: aliasDeprecations.get(selector) ?? null,
            lifecycle:
              aliasLifecycles.get(selector) ??
              (aliasDeprecations.has(selector)
                ? {
                    status: "deprecated",
                    since: null,
                    removalVersion: null,
                    replacement: null,
                    reason: aliasDeprecations.get(selector),
                  }
                : {
                    status: "active",
                    since: null,
                    removalVersion: null,
                    replacement: null,
                    reason: null,
                  }),
            source: relationSource,
          })),
        ],
        qualifiedHosts: parseLines(tags.get("qualified-hosts")),
        slots: parseSlots(tags.get("slots"), relationSource).map((slot) => ({
          ...slot,
          kind: "slot",
          owner,
          classes: relationClasses(slot.selector, owner),
        })),
        accessibility: tags.get("accessibility")?.trim() ?? null,
        preferOver: tags.get("prefer-over")?.trim() ?? null,
        related,
        source: { ...base.source, declarationLine: target?.line ?? null },
      });
    } else if (kind === "pattern-group") {
      const members = (tags.get("members") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const related = tags.get("related")
        ? tags
            .get("related")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const group = {
        name: tags.get("pattern-group")?.trim(),
        kind: "pattern-group",
        ...base,
        members,
        example: tags.get("example")?.trim() ?? "",
        preferOver: tags.get("prefer-over")?.trim() ?? null,
        related,
        memberContracts: [],
      };
      registry.patternGroups.push(group);

      for (let index = 0; index < members.length; index++) {
        const member = members[index];
        const target = b.targets.filter(
          (candidate) => candidate.type === "pattern",
        )[index];
        const memberContract = {
          name: member,
          kind: "pattern-group-member",
          group: group.name,
          ...base,
          canonicalSelector: `.${member}`,
          declaredSelector: target?.selector ?? null,
          layer: target?.layer ?? null,
          example: group.example,
          modifiers: [],
          modifierContracts: [],
          stateContracts: [],
          aliases: [],
          qualifiedHosts: [],
          slots: [],
          accessibility: tags.get("accessibility")?.trim() ?? null,
          preferOver: group.preferOver,
          related,
          source: { ...base.source, declarationLine: target?.line ?? null },
        };
        group.memberContracts.push(memberContract);
        registry.patternGroupMembers.push(memberContract);
      }
    } else if (kind === "token") {
      const target = b.targets.find((t) => t.type === "token");
      registry.tokens.push({
        name: tags.get("token")?.trim(),
        ...base,
        category: tags.get("category")?.trim() ?? "",
        source: { ...base.source, declarationLine: target?.line ?? null },
      });
    } else if (kind === "token-group") {
      const members = b.targets
        .filter((t) => t.type === "token")
        .map((t) => t.name);
      registry.tokenGroups.push({
        name: tags.get("token-group")?.trim(),
        ...base,
        category: tags.get("category")?.trim() ?? "",
        matches: tags.get("matches")?.trim() ?? "",
        scale: tags.get("scale")?.trim() ?? null,
        members,
      });
    }
  }

  const descriptiveEntries = new Map();
  for (const token of registry.tokens) {
    descriptiveEntries.set(token.name, {
      category: token.category,
      role: token.role,
      group: null,
      since: token.since,
      deprecated: token.deprecated,
    });
  }
  for (const group of registry.tokenGroups) {
    for (const member of group.members) {
      descriptiveEntries.set(member, {
        category: group.category,
        role: group.role,
        group: group.name,
        since: group.since,
        deprecated: group.deprecated,
      });
    }
  }

  for (const token of tokenInventory.records) {
    const classification = tokenClassification.classificationByToken.get(
      token.name,
    );
    if (!classification) continue;

    const description = descriptiveEntries.get(token.name);
    const definitionLines = [
      ...token.registrations.map((entry) => entry.line),
      ...token.declarations.map((entry) => entry.line),
    ];
    const firstDefinitionLine =
      definitionLines.length > 0 ? Math.min(...definitionLines) : null;
    const firstConsumptionLine =
      token.consumptions.length > 0
        ? Math.min(...token.consumptions.map((entry) => entry.line))
        : null;

    let themeScope = "inherited";
    if (classification.tier === "component-contract") {
      themeScope = "component-local";
    } else if (classification.tier === "private-calculated") {
      themeScope = "internal";
    } else if (tokenInventory.themeScopedTokens.has(token.name)) {
      themeScope = "rederived";
    }
    const declarationRecords = selectorRecords.flatMap((record) =>
      record.declarations
        .filter((declaration) => declaration.property === token.name)
        .map((declaration) => ({ record, declaration })),
    );
    const consumptionRecords = selectorRecords.flatMap((record) =>
      record.declarations.flatMap((declaration) =>
        declaration.references
          .filter((reference) => reference.name === token.name)
          .map((reference) => ({ record, declaration, reference })),
      ),
    );
    const registration = tokenInventory.propertyRegistrations.get(token.name);
    const defaultValue =
      declarationRecords[0]?.declaration.value ??
      registration?.initialValue ??
      consumptionRecords.find(({ reference }) => reference.fallback)?.reference
        .fallback ??
      null;

    registry.tokenInventory.push({
      name: token.name,
      kind: "token",
      canonicalSelector: token.name,
      tier: classification.tier,
      public: classification.visibility === "public",
      category: description?.category ?? "misc",
      role: description?.role ?? classification.role,
      group: description?.group ?? classification.name,
      default: defaultValue,
      inheritance:
        registration?.inherits === false ? "non-inheriting" : "inherited",
      registration: registration
        ? {
            syntax: registration.syntax,
            initialValue: registration.initialValue,
            inherits: registration.inherits,
            source: { file: sourcePath, ...registration.source },
          }
        : null,
      defaultStability: classification.defaultStability,
      themeScope,
      registered: token.registrations.length > 0,
      declared: token.declarations.length > 0,
      consumed: token.consumptions.length > 0,
      declarationCount: token.declarations.length,
      consumptionCount: token.consumptions.length,
      requirements: [
        ...new Set([
          ...declarationRecords.flatMap(
            ({ declaration }) => declaration.features,
          ),
          ...consumptionRecords.flatMap(
            ({ declaration }) => declaration.features,
          ),
        ]),
      ].sort(),
      bundleMembership: [
        ...new Set(
          [...declarationRecords, ...consumptionRecords].flatMap(({ record }) =>
            bundlesForLayer(record.layer, registry.bundles),
          ),
        ),
      ].sort(),
      since: description?.since ?? null,
      deprecated: description?.deprecated ?? null,
      source: {
        file: sourcePath,
        classificationLine: classification.source.line,
        firstDefinitionLine,
        firstConsumptionLine,
      },
    });
  }

  const cssSurface = buildCssSurface(
    registry,
    selectorRecords,
    registry.bundles,
  );
  Object.assign(registry, cssSurface);

  return registry;
}

/* ------------------------------------------------------------------ *
 * Top-level lint
 * ------------------------------------------------------------------ */

/**
 * Pure function. Takes CSS source + optional path label, returns
 * { violations, registry, summary }.
 */
function collectLayers(ast, selectorRecords, bundles) {
  const order = [];
  for (const node of ast.children?.toArray() ?? []) {
    if (node.type !== "Atrule" || node.name !== "layer" || node.block) continue;
    const rendered = node.prelude ? cssTree.generate(node.prelude) : "";
    order.push(
      ...rendered
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean),
    );
  }

  return order.map((name, index) => {
    const records = selectorRecords.filter((record) => record.layer === name);
    return {
      name,
      kind: "layer",
      order: index,
      bundleMembership: bundlesForLayer(name, bundles),
      source: uniqueBy(
        records.map((record) => record.source),
        (source) => `${source.file}:${source.line}`,
      ),
    };
  });
}

function featureId(label) {
  const normalized = label.toLowerCase();
  if (normalized.includes("relative colour")) return "relative-color";
  if (normalized.includes("light-dark")) return "light-dark";
  if (normalized.includes("color-mix")) return "color-mix";
  if (normalized.includes("container")) return "container-queries";
  if (normalized.includes("linear")) return "linear-easing";
  if (normalized.includes("anchor positioning")) return "anchor-positioning";
  if (normalized.includes("cascade layer")) return "cascade-layers";
  if (normalized.includes("forced-colors")) return "forced-colors";
  if (normalized.includes("accent-color")) return "accent-color";
  if (normalized.includes("popover")) return "popover";
  if (normalized.includes("oklch")) return "oklch";
  return normalized
    .replace(/`|\*|\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseMarkdownTables(source) {
  const tables = [];
  const lines = source.split("\n");
  for (let index = 0; index < lines.length - 1; index++) {
    if (!lines[index].trim().startsWith("|")) continue;
    if (!/^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(lines[index + 1])) continue;
    const headers = lines[index]
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    const rows = [];
    index += 2;
    while (index < lines.length && lines[index].trim().startsWith("|")) {
      rows.push(
        lines[index]
          .split("|")
          .slice(1, -1)
          .map((cell) => cell.trim()),
      );
      index++;
    }
    index--;
    tables.push({ headers, rows });
  }
  return tables;
}

export function parseBrowserSupportMarkdown(source) {
  const tables = parseMarkdownTables(source);
  const usageTable = tables.find(
    (table) => table.headers[0] === "Feature" && table.headers[1] === "Used by",
  );
  const browserTable = tables.find(
    (table) =>
      table.headers[0] === "Feature" && table.headers.includes("Chrome"),
  );
  const browsersByFeature = new Map(
    (browserTable?.rows ?? []).map((row) => [
      featureId(row[0]),
      Object.fromEntries(
        browserTable.headers
          .slice(1)
          .map((browser, index) => [
            browser.toLowerCase(),
            row[index + 1].replaceAll("**", ""),
          ]),
      ),
    ]),
  );

  return (usageTable?.rows ?? []).map((row) => {
    const id = featureId(row[0]);
    return {
      id,
      kind: "feature-requirement",
      name: row[0].replaceAll("**", "").replaceAll("`", ""),
      usedBy: row[1],
      browsers: browsersByFeature.get(id) ?? null,
      source: { file: "docs/BROWSER-SUPPORT.md" },
    };
  });
}

function packageSpecifier(packageName, exportName) {
  return exportName === "."
    ? packageName
    : `${packageName}${exportName.slice(1)}`;
}

function bundleLayersForTarget(target) {
  if (target.includes("/themes/")) return ["themes"];
  const fileName = path.basename(target);
  if (
    ["index.css", "index.min.css", "drop-in.css", "drop-in.min.css"].includes(
      fileName,
    )
  ) {
    return [
      "base",
      "themes",
      "components",
      "utilities",
      "layouts",
      "unlayered",
    ];
  }
  if (fileName === "core.css") return ["base", "unlayered"];
  if (fileName === "components.css") return ["components", "unlayered"];
  if (fileName === "layouts.css") return ["layouts", "unlayered"];
  if (fileName === "utilities.css") return ["utilities", "unlayered"];
  if (fileName === "minimal.css") return ["base", "utilities", "unlayered"];
  if (fileName === "standard.css") {
    return ["base", "utilities", "layouts", "unlayered"];
  }
  return [];
}

function packageLine(source, key) {
  const index = source.indexOf(JSON.stringify(key));
  return index === -1 ? null : source.slice(0, index).split("\n").length;
}

function sourceLine(source, offset) {
  return source.slice(0, offset).split("\n").length;
}

function collectPackageDocumentationReferences(document) {
  const references = [];
  const matcher = /@drop-in\/graffiti(?:\/[a-zA-Z0-9._/-]+)?/g;
  for (const match of document.source.matchAll(matcher)) {
    references.push({
      value: match[0].replace(/\/+$/, ""),
      kind: "package-export",
      source: {
        file: document.path,
        line: sourceLine(document.source, match.index ?? 0),
      },
    });
  }
  return references;
}

function collectCssDocumentationReferences(documents) {
  const references = [];
  for (const document of documents) {
    if (!document.path.startsWith("src/docs/content/topics/")) continue;
    const { frontmatter } = parseMarkdownDocument(
      document.source,
      document.path,
    );
    for (const value of frontmatter.classes ?? []) {
      const offset = document.source.indexOf(String(value));
      references.push({
        value: String(value),
        kind: "css",
        source: {
          file: document.path,
          line: sourceLine(document.source, Math.max(0, offset)),
        },
      });
    }
  }

  for (const section of agentSections) {
    for (const topic of section.usageOrder) {
      for (const value of topic.classes) {
        references.push({
          value,
          kind: "css",
          source: {
            file: "src/docs/agent/manifest.js",
            line: null,
            context: `${section.slug}/${topic.slug}`,
          },
        });
      }
    }
  }
  for (const template of templatePages) {
    for (const value of template.classes) {
      references.push({
        value,
        kind: "css",
        source: {
          file: "src/docs/agent/manifest.js",
          line: null,
          context: `templates/${template.slug}`,
        },
      });
    }
  }

  return references;
}

function referenceRegex(reference) {
  const pattern = escapeRegExp(reference)
    .replace(/\\\*/g, ".*")
    .replace(/1\\\.\\\.9/g, "[1-9]");
  return new RegExp(`^${pattern}$`);
}

function resolveDocumentationReference(registry, reference) {
  if (reference.kind === "package-export") {
    const entry = registry.packageExports.find(
      (candidate) => candidate.specifier === reference.value,
    );
    return entry ? [{ kind: "package-export", name: entry.name }] : [];
  }

  if (reference.value.startsWith("--")) {
    const matcher = referenceRegex(reference.value);
    return registry.tokenInventory
      .filter((token) => token.public && matcher.test(token.name))
      .map((token) => ({ kind: "token", name: token.name }));
  }

  const classReferences = [
    ...reference.value.matchAll(/\.([a-zA-Z_-][a-zA-Z0-9_-]*\*?)/g),
  ].map((match) => match[1]);
  if (classReferences.length > 0) {
    const targets = [];
    for (const classReference of classReferences) {
      const matcher = referenceRegex(classReference);
      const classTargets = registry.classContracts
        .filter((contract) => contract.public && matcher.test(contract.name))
        .map((contract) => ({ kind: "class", name: contract.name }));
      const themeTargets = registry.themes
        .filter((theme) => matcher.test(theme.name))
        .map((theme) => ({ kind: "theme", name: theme.name }));
      if (classTargets.length + themeTargets.length === 0) return [];
      targets.push(...classTargets, ...themeTargets);
    }
    return uniqueBy(targets, (target) => `${target.kind}:${target.name}`);
  }

  const element = registry.elements.find(
    (candidate) => candidate.name === reference.value,
  );
  return element ? [{ kind: "element", name: element.name }] : [];
}

function validateDocumentationReferences(registry, references, violations) {
  registry.documentationReferences = references.map((reference) => {
    const targets = resolveDocumentationReference(registry, reference);
    if (targets.length === 0) {
      violations.push({
        file: reference.source.file,
        line: reference.source.line ?? 1,
        message: `Documented public reference ${JSON.stringify(reference.value)} does not resolve to a public class, token, theme, element, or package export`,
        rule: "documentation-resolves",
      });
    }
    return { ...reference, resolved: targets.length > 0, targets };
  });

  const uniqueReferences = uniqueBy(
    registry.documentationReferences,
    (reference) => `${reference.kind}:${reference.value}`,
  );
  registry.coverage.documentedReferences = uniqueReferences.length;
  registry.coverage.resolvedDocumentedReferences = uniqueReferences.filter(
    (reference) => reference.resolved,
  ).length;
  registry.coverage.unresolvedDocumentedReferences = uniqueReferences
    .filter((reference) => !reference.resolved)
    .map((reference) => reference.value);
}

async function loadExternalContracts() {
  const packageSource = await readFile(
    path.join(repoRoot, "package.json"),
    "utf8",
  );
  const packageJson = JSON.parse(packageSource);
  const firstExportForTarget = new Map();
  const packageExports = Object.entries(packageJson.exports ?? {}).map(
    ([name, target]) => {
      const aliasOf = firstExportForTarget.get(target) ?? null;
      if (!aliasOf) firstExportForTarget.set(target, name);
      return {
        name,
        kind: "package-export",
        specifier: packageSpecifier(packageJson.name, name),
        target,
        format: path.extname(target).slice(1),
        aliasOf,
        since: null,
        deprecated: null,
        source: {
          file: "package.json",
          line: packageLine(packageSource, name),
        },
      };
    },
  );
  const bundles = packageExports
    .filter((entry) => entry.format === "css")
    .map((entry) => ({
      name: entry.name,
      kind: "bundle",
      specifier: entry.specifier,
      target: entry.target,
      layers: bundleLayersForTarget(entry.target),
      aliasOf: entry.aliasOf,
      source: entry.source,
    }));
  const commands = Object.entries(packageJson.bin ?? {}).map(
    ([name, target]) => ({
      name,
      kind: "command",
      target,
      since: null,
      deprecated: null,
      source: { file: "package.json", line: packageLine(packageSource, name) },
    }),
  );

  const themeDirectory = path.join(repoRoot, "src/lib/themes");
  const themeFiles = (await readdir(themeDirectory))
    .filter((file) => file.endsWith(".css") && file !== "index.css")
    .sort();
  const themes = [];
  for (const file of themeFiles) {
    const source = await readFile(path.join(themeDirectory, file), "utf8");
    const name = file.replace(/\.css$/, "");
    const className = `theme-${name}`;
    const themeAst = cssTree.parse(source, {
      parseCustomProperty: true,
      positions: true,
    });
    let selectorLine = null;
    const declaredTokens = new Set();
    const consumedTokens = new Set();
    cssTree.walk(themeAst, {
      enter(node) {
        if (node.type === "Declaration") {
          if (node.property.startsWith("--")) {
            declaredTokens.add(node.property);
          }
          for (const reference of collectVarFunctions(
            cssTree.generate(node.value),
          )) {
            consumedTokens.add(reference.name);
          }
        } else if (
          node.type === "Rule" &&
          selectorLine === null &&
          node.prelude &&
          inspectSelector(cssTree.generate(node.prelude)).classNames.has(
            className,
          )
        ) {
          selectorLine = node.loc?.start.line ?? null;
        }
      },
    });
    themes.push({
      name: className,
      kind: "theme",
      canonicalSelector: `.${className}`,
      layer: "themes",
      aliases: [],
      tokens: [...declaredTokens].sort(),
      consumedTokens: [...consumedTokens].sort(),
      requirements: detectFeatures(source),
      bundleMembership: packageExports
        .filter(
          (entry) =>
            entry.target.endsWith(`/themes/${name}.css`) ||
            entry.target.endsWith("/themes/index.css"),
        )
        .map((entry) => entry.name)
        .sort(),
      since: null,
      deprecated: null,
      source: {
        file: `src/lib/themes/${file}`,
        line: selectorLine,
      },
    });
  }

  const browserSupport = await readFile(
    path.join(repoRoot, "docs/BROWSER-SUPPORT.md"),
    "utf8",
  );
  const documents = await readDocumentationFiles();
  return {
    bundles,
    commands,
    documentationReferences: [
      ...collectCssDocumentationReferences(documents),
      ...documents.flatMap(collectPackageDocumentationReferences),
    ],
    features: parseBrowserSupportMarkdown(browserSupport),
    packageExports,
    themes,
  };
}

function parseStylesheet(source, sourcePath) {
  const annotationComments = [];
  const ast = cssTree.parse(source, {
    parseCustomProperty: true,
    positions: true,
    onComment: (value, loc) => {
      // Only `/** ... */` (starts with `*`) are candidate annotations.
      // Regular `/* ... */` (value starts with space or other) are ignored.
      const isJsdoc = value.startsWith("*");
      if (!isJsdoc) return;
      const parsed = parseAnnotation(value);
      annotationComments.push({
        ...parsed,
        sourcePath,
        line: loc.start.line,
        endLine: loc.end.line,
        raw: value,
      });
    },
  });
  return { annotationComments, ast };
}

export function lintCss(
  source,
  { sourcePath = "src/lib/drop-in.css", externalContracts = {} } = {},
) {
  const parsedSource = parseStylesheet(source, sourcePath);
  const annotationComments = [...parsedSource.annotationComments];
  const { ast } = parsedSource;

  const selectorRecords = collectSelectorRecords(ast, sourcePath);
  const contracts = {
    ...externalContracts,
    bundles: externalContracts.bundles ?? [],
  };
  contracts.layers = collectLayers(ast, selectorRecords, contracts.bundles);
  const themeScopeRecord = selectorRecords.find((record) =>
    record.selector.includes('[class*="theme-"]'),
  );
  if (themeScopeRecord) {
    contracts.themes = [
      ...(externalContracts.themes ?? []),
      {
        name: "theme-scope",
        kind: "theme-scope",
        canonicalSelector: themeScopeRecord.selector,
        layer: themeScopeRecord.layer,
        aliases: [],
        tokens: themeScopeRecord.declarations
          .filter((declaration) => declaration.property.startsWith("--"))
          .map((declaration) => declaration.property)
          .sort(),
        requirements: themeScopeRecord.features,
        bundleMembership: bundlesForLayer(
          themeScopeRecord.layer,
          contracts.bundles,
        ),
        since: null,
        deprecated: null,
        source: themeScopeRecord.source,
      },
    ];
  }
  if (!contracts.features) {
    contracts.features = [
      ...new Set([
        ...detectFeatures(source),
        ...selectorRecords.flatMap((record) => record.features),
      ]),
    ]
      .sort()
      .map((id) => ({
        id,
        kind: "feature-requirement",
        name: id,
        usedBy: null,
        browsers: null,
        source: { file: sourcePath },
      }));
  }
  const targets = collectTargets(ast, selectorRecords, annotationComments);
  const tokenInventory = collectTokenInventory(source, ast);
  const mainPairing = pairAnnotationsToTargets(annotationComments, targets);
  const blocks = [...mainPairing.blocks];
  const orphanTargets = [...mainPairing.orphanTargets];
  const orphanAnnotations = [...mainPairing.orphanAnnotations];

  const violations = [];

  // Coverage violations
  for (const t of orphanTargets) {
    violations.push({
      line: t.line,
      message:
        t.type === "pattern"
          ? `Missing annotation: class .${t.name} has no preceding @pattern or @pattern-group block`
          : `Missing annotation: token ${t.name} has no preceding @token or @token-group block`,
      rule: "coverage",
    });
  }

  for (const a of orphanAnnotations) {
    violations.push({
      line: a.line,
      message: `@${a.kind} block has no target (no class or token follows it within scope)`,
      rule: "orphan-annotation",
    });
  }

  // Per-block validation
  for (const b of blocks) {
    validateBlock(b, violations);
  }

  // Cross-block validation (sees orphan annotations too)
  validateCrossBlock(blocks, annotationComments, violations);

  const tokenClassification = validateTokenSets(
    annotationComments,
    tokenInventory,
    violations,
  );

  // Sort violations by line for stable output
  violations.sort((a, b) => a.line - b.line || a.rule.localeCompare(b.rule));

  const registry = buildRegistry(
    blocks,
    sourcePath,
    tokenInventory,
    tokenClassification,
    selectorRecords,
    contracts,
  );
  validateOwnerRelations(registry, selectorRecords, violations);

  const publicTokenNames = new Set(
    registry.tokenInventory
      .filter((token) => token.public)
      .map((token) => token.name),
  );
  for (const theme of registry.themes) {
    const publicTokens = [];
    for (const token of theme.tokens) {
      if (publicTokenNames.has(token)) {
        publicTokens.push(token);
        continue;
      }
      if (theme.consumedTokens?.includes(token)) continue;
      violations.push({
        file: theme.source.file,
        line: theme.source.line ?? 1,
        message: `Theme ${theme.name} overrides ${token}, but that token is not a public Registry v2 token`,
        rule: "theme-token-resolves",
      });
    }
    theme.tokens = publicTokens;
    delete theme.consumedTokens;

    if (theme.kind !== "theme") continue;
    const themeSlug = theme.name.replace(/^theme-/, "");
    const hasThemeExport = registry.packageExports.some(
      (entry) => entry.name === `./themes/${themeSlug}`,
    );
    if (theme.source.line === null || !hasThemeExport) {
      violations.push({
        file: theme.source.file,
        line: theme.source.line ?? 1,
        message: `Theme ${theme.name} must have a matching class selector and ./themes/${themeSlug} package export`,
        rule: "theme-contract-resolves",
      });
    }
  }

  validateDocumentationReferences(
    registry,
    externalContracts.documentationReferences ?? [],
    violations,
  );

  const requirementEntries = [
    ...registry.patterns,
    ...registry.tokenInventory,
    ...registry.themes,
    ...registry.selectorContracts,
  ];
  if (registry.features.length > 0) {
    const featureIds = new Set(registry.features.map((feature) => feature.id));
    for (const entry of requirementEntries) {
      for (const requirement of entry.requirements ?? []) {
        if (featureIds.has(requirement)) continue;
        violations.push({
          file: entry.source?.file ?? sourcePath,
          line:
            entry.source?.line ??
            entry.source?.annotationLine ??
            entry.source?.classificationLine ??
            1,
          message: `Feature requirement ${requirement} does not resolve in registry.features`,
          rule: "feature-requirement-resolves",
        });
      }
    }
  }

  const bundleNames = new Set(registry.bundles.map((bundle) => bundle.name));
  for (const entry of requirementEntries) {
    for (const bundle of entry.bundleMembership ?? []) {
      if (bundleNames.has(bundle)) continue;
      violations.push({
        file: entry.source?.file ?? sourcePath,
        line:
          entry.source?.line ??
          entry.source?.annotationLine ??
          entry.source?.classificationLine ??
          1,
        message: `Bundle membership ${bundle} does not resolve in registry.bundles`,
        rule: "bundle-membership-resolves",
      });
    }
  }

  for (const relation of registry.coverage.unexplainedRelations) {
    violations.push({
      file: relation.source.file,
      line: relation.source.line ?? 1,
      message: `Unexplained public relation .${relation.name} in ${relation.canonicalSelector} for owner ${relation.owner}; declare it as that owner's modifier, alias, state, or slot`,
      rule: "selector-coverage",
    });
  }
  violations.sort((a, b) => a.line - b.line || a.rule.localeCompare(b.rule));
  const tierCounts = Object.fromEntries(
    [...TOKEN_TIERS].map((tier) => [
      tier,
      registry.tokenInventory.filter((token) => token.tier === tier).length,
    ]),
  );

  return {
    violations,
    registry,
    summary: {
      targets: targets.length,
      blocks: blocks.length,
      patterns: registry.patterns.length,
      patternGroups: registry.patternGroups.length,
      tokens: registry.tokens.length,
      tokenGroups: registry.tokenGroups.length,
      inventoryTokens: registry.tokenInventory.length,
      publicClassNames: registry.coverage.publicClassNames,
      publicSelectors: registry.coverage.publicSelectors,
      unexplainedSelectors: registry.coverage.unexplainedSelectors.length,
      documentedReferences: registry.coverage.documentedReferences,
      tierCounts,
    },
  };
}

/* ------------------------------------------------------------------ *
 * CLI
 * ------------------------------------------------------------------ */

const filePath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(filePath);
const repoRoot = path.resolve(scriptDir, "..");

const DEFAULTS = {
  input: path.join(repoRoot, "src/lib/drop-in.css"),
  registry: path.join(repoRoot, "src/lib/registry.json"),
};

const DOCUMENTATION_TARGETS = [
  "README.md",
  "CONTEXT.md",
  "docs",
  "src/docs/content",
  "src/docs/agent",
  "skills/graffiti-best-practices",
  "static/llms",
];

const DOCUMENTATION_EXTENSIONS = new Set([".md", ".txt", ".js"]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findPrivateTokenReferences(documents, privateTokenNames) {
  const violations = [];
  const matchers = [...privateTokenNames]
    .sort((a, b) => b.length - a.length)
    .map((name) => ({
      name,
      regex: new RegExp(`${escapeRegExp(name)}(?![a-zA-Z0-9_-])`),
    }));

  for (const document of documents) {
    const lines = document.source.split("\n");
    for (let index = 0; index < lines.length; index++) {
      for (const matcher of matchers) {
        if (!matcher.regex.test(lines[index])) continue;
        violations.push({
          file: document.path,
          line: index + 1,
          rule: "private-token-docs",
          message: `Documentation references private token ${matcher.name}; private calculated tokens are implementation details and must not be recommended to consumers or agents`,
        });
      }
    }
  }

  return violations;
}

async function readDocumentationFiles() {
  const documents = [];

  const visit = async (targetPath) => {
    let entries;
    try {
      entries = await readdir(targetPath, { withFileTypes: true });
    } catch (error) {
      if (error?.code === "ENOTDIR") {
        if (DOCUMENTATION_EXTENSIONS.has(path.extname(targetPath))) {
          documents.push({
            path: path.relative(repoRoot, targetPath),
            source: await readFile(targetPath, "utf8"),
          });
        }
        return;
      }
      if (error?.code === "ENOENT") return;
      throw error;
    }

    for (const entry of entries) {
      const entryPath = path.join(targetPath, entry.name);
      if (entry.isDirectory()) await visit(entryPath);
      else if (DOCUMENTATION_EXTENSIONS.has(path.extname(entry.name))) {
        documents.push({
          path: path.relative(repoRoot, entryPath),
          source: await readFile(entryPath, "utf8"),
        });
      }
    }
  };

  for (const target of DOCUMENTATION_TARGETS) {
    await visit(path.join(repoRoot, target));
  }

  return documents;
}

export async function runLint({
  input = DEFAULTS.input,
  registryOut = DEFAULTS.registry,
  check = false,
} = {}) {
  const source = await readFile(input, "utf8");
  const sourcePath = path.relative(repoRoot, input);
  const result = lintCss(source, {
    sourcePath,
    externalContracts: await loadExternalContracts(),
  });
  const privateTokenNames = result.registry.tokenInventory
    .filter((token) => !token.public)
    .map((token) => token.name);
  result.violations.push(
    ...findPrivateTokenReferences(
      await readDocumentationFiles(),
      privateTokenNames,
    ),
  );

  if (result.violations.length === 0) {
    const generatedRegistry = `${JSON.stringify(result.registry, null, 2)}\n`;

    if (!check) {
      await writeFile(registryOut, generatedRegistry);
      console.log(
        `graffiti-lint: clean. ${result.summary.patterns} patterns, ${result.summary.patternGroups} groups, ${result.summary.publicClassNames} public classes, ${result.summary.publicSelectors} selectors, ${result.summary.inventoryTokens} classified tokens across four tiers → ${path.relative(repoRoot, registryOut)}`,
      );
    } else {
      let currentRegistry;
      try {
        currentRegistry = await readFile(registryOut, "utf8");
      } catch (error) {
        if (error?.code === "ENOENT") {
          console.error(
            `graffiti-lint: missing generated registry ${path.relative(repoRoot, registryOut)}. Run \`pnpm lint:graffiti\` to generate it.`,
          );
          return 1;
        }
        throw error;
      }

      if (currentRegistry !== generatedRegistry) {
        console.error(
          `graffiti-lint: ${path.relative(repoRoot, registryOut)} is out of date. Run \`pnpm lint:graffiti\` to regenerate it.`,
        );
        return 1;
      }

      console.log(
        `graffiti-lint: clean. ${result.summary.targets} targets covered by ${result.summary.blocks} annotation blocks; registry is in sync.`,
      );
    }
    return 0;
  }

  console.error(
    `graffiti-lint: ${result.violations.length} violation(s) in ${sourcePath}\n`,
  );
  for (const v of result.violations) {
    console.error(
      `  ${v.file ?? sourcePath}:${v.line}  [${v.rule}]  ${v.message}`,
    );
  }
  console.error(
    `\n${result.summary.targets} targets, ${result.summary.blocks} annotation blocks. See docs/ANNOTATION-SPEC.md.`,
  );
  return 1;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === filePath;
if (isCli) {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const exitCode = await runLint({ check });
  process.exit(exitCode);
}
