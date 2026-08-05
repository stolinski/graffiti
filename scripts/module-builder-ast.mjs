import { generate, parse } from "css-tree";

const REQUIRED_LAYER_NAMES = ["base", "components", "layouts", "utilities"];

function getSingleLayerName(node) {
  const preludeChildren = node.prelude?.children?.toArray() ?? [];
  if (preludeChildren.length !== 1 || preludeChildren[0].type !== "LayerList") {
    return null;
  }

  const layers = preludeChildren[0].children?.toArray() ?? [];
  return layers.length === 1 && layers[0].type === "Layer"
    ? layers[0].name
    : null;
}

function isCanonicalRootRule(node) {
  if (node.type !== "Rule" || node.prelude?.type !== "SelectorList") {
    return false;
  }

  const selectors = node.prelude.children.toArray();
  if (selectors.length !== 1) {
    return false;
  }

  const parts = selectors[0].children?.toArray() ?? [];
  return (
    parts.length === 1 &&
    parts[0].type === "PseudoClassSelector" &&
    parts[0].name.toLowerCase() === "root" &&
    parts[0].children === null
  );
}

function formatLocation(location) {
  return `line ${location.start.line}, column ${location.start.column}`;
}

function createBuildError(sourcePath, message, location, parseErrors = []) {
  const locationText = location ? ` at ${formatLocation(location)}` : "";
  const parseContext = parseErrors.length
    ? ` css-tree recovery: ${parseErrors[0].message} at line ${parseErrors[0].line}, column ${parseErrors[0].column}.`
    : "";

  return new Error(
    `CSS module build failed for ${sourcePath}${locationText}: ${message}.${parseContext}`,
  );
}

function getAnnotationRange(source, location) {
  let start = location.start.offset;
  let end = location.end.offset;
  const lineStart = source.lastIndexOf("\n", start - 1) + 1;

  if (source.slice(lineStart, start).trim() === "") {
    start = lineStart;
  }
  if (source[end] === "\r") {
    end += 1;
  }
  if (source[end] === "\n") {
    end += 1;
  }

  return { start, end };
}

function applySourceEdits(source, edits) {
  let result = source;

  for (const edit of [...edits].sort((a, b) => b.start - a.start)) {
    result =
      result.slice(0, edit.start) +
      (edit.replacement ?? "") +
      result.slice(edit.end);
  }

  return result.replace(/\n{3,}/g, "\n\n");
}

function sourceRange(source, start, end, annotationRanges) {
  const edits = annotationRanges
    .filter((range) => range.start >= start && range.end <= end)
    .map((range) => ({
      start: range.start - start,
      end: range.end - start,
    }));

  return applySourceEdits(source.slice(start, end), edits);
}

function getPropertyName(node) {
  if (node.type !== "Atrule" || node.name.toLowerCase() !== "property") {
    return null;
  }

  const children = node.prelude?.children?.toArray() ?? [];
  return children.length === 1 && children[0].type === "Identifier"
    ? children[0].name
    : null;
}

/**
 * Parse and validate the source structure used by the module build.
 * css-tree recovers unsupported modern nesting as Raw nodes, so parse
 * recovery is fatal only at stylesheet scope. Required layer boundaries are
 * validated against their AST locations to catch synthesized closing braces.
 */
export function parseModuleSource(source, sourcePath = "src/lib/drop-in.css") {
  const annotationRanges = [];
  const comments = [];
  const parseErrors = [];
  let ast;

  try {
    ast = parse(source, {
      filename: sourcePath,
      parseCustomProperty: true,
      positions: true,
      onComment(value, location) {
        comments.push({ value, location });
        if (value.startsWith("*")) {
          annotationRanges.push(getAnnotationRange(source, location));
        }
      },
      onParseError(error) {
        parseErrors.push(error);
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw createBuildError(sourcePath, `unable to parse CSS: ${message}`);
  }

  const topLevelNodes = ast.children.toArray();
  const topLevelLayerNodes = topLevelNodes.filter(
    (node) =>
      node.type === "Atrule" &&
      node.name.toLowerCase() === "layer" &&
      node.block,
  );
  const layers = new Map();

  for (const node of topLevelLayerNodes) {
    const layerName = getSingleLayerName(node);
    if (layerName === null || !REQUIRED_LAYER_NAMES.includes(layerName)) {
      continue;
    }
    if (layers.has(layerName)) {
      throw createBuildError(
        sourcePath,
        `duplicate required top-level @layer ${layerName}`,
        node.loc,
        parseErrors,
      );
    }
    layers.set(layerName, node);
  }

  const missingLayers = REQUIRED_LAYER_NAMES.filter(
    (name) => !layers.has(name),
  );
  if (missingLayers.length > 0) {
    const foundLayers = topLevelLayerNodes
      .map((node) => getSingleLayerName(node) ?? generate(node.prelude))
      .join(", ");
    throw createBuildError(
      sourcePath,
      `missing required top-level layer${missingLayers.length === 1 ? "" : "s"} ${missingLayers.map((name) => `@layer ${name}`).join(", ")} (found: ${foundLayers || "none"})`,
      null,
      parseErrors,
    );
  }

  for (const [layerName, node] of layers) {
    const blockStart = node.block.loc.start.offset;
    const blockEnd = node.block.loc.end.offset;
    if (source[blockStart] !== "{" || source[blockEnd - 1] !== "}") {
      throw createBuildError(
        sourcePath,
        `malformed @layer ${layerName} boundary; expected a real closing brace before the AST node ended`,
        node.loc,
        parseErrors,
      );
    }
  }

  const requiredLayerNodes = [...layers.values()];
  const topLevelParseError = parseErrors.find(
    (error) =>
      !requiredLayerNodes.some(
        (node) =>
          error.offset > node.block.loc.start.offset &&
          error.offset < node.block.loc.end.offset,
      ),
  );
  const topLevelRaw = topLevelNodes.find((node) => node.type === "Raw");
  if (topLevelParseError || topLevelRaw) {
    const error = topLevelParseError;
    throw createBuildError(
      sourcePath,
      error
        ? `malformed top-level CSS: ${error.message}`
        : "malformed top-level CSS",
      topLevelRaw?.loc ?? null,
      error ? [error] : [],
    );
  }

  const layerOrderNodes = topLevelNodes.filter(
    (node) =>
      node.type === "Atrule" &&
      node.name.toLowerCase() === "layer" &&
      node.block === null,
  );
  if (layerOrderNodes.length !== 1) {
    throw createBuildError(
      sourcePath,
      `expected exactly one canonical top-level @layer order statement, found ${layerOrderNodes.length}`,
    );
  }

  const base = layers.get("base");
  const rootRules = base.block.children.toArray().filter(isCanonicalRootRule);
  if (rootRules.length !== 1) {
    throw createBuildError(
      sourcePath,
      `expected exactly one immediate canonical :root rule in @layer base, found ${rootRules.length}`,
      base.loc,
      parseErrors,
    );
  }

  const reducedMotionProperties = base.block.children
    .toArray()
    .filter((node) => getPropertyName(node) === "--animation-reduced");
  if (reducedMotionProperties.length !== 1) {
    throw createBuildError(
      sourcePath,
      `expected exactly one immediate @property --animation-reduced in @layer base, found ${reducedMotionProperties.length}`,
      base.loc,
      parseErrors,
    );
  }

  const lastLayerEnd = Math.max(
    ...requiredLayerNodes.map((node) => node.loc.end.offset),
  );
  const globalNodes = topLevelNodes.filter(
    (node) => node.loc.start.offset >= lastLayerEnd,
  );
  const globalMedia = new Set(
    globalNodes
      .filter(
        (node) => node.type === "Atrule" && node.name.toLowerCase() === "media",
      )
      .map((node) => generate(node.prelude)),
  );
  const missingGlobalMedia = [
    "(prefers-reduced-motion:reduce)",
    "print",
  ].filter((query) => !globalMedia.has(query));
  if (missingGlobalMedia.length > 0) {
    throw createBuildError(
      sourcePath,
      `missing required unlayered media ${missingGlobalMedia.join(", ")}`,
    );
  }

  return {
    annotationRanges,
    ast,
    canonicalRoot: rootRules[0],
    comments,
    layerOrder: layerOrderNodes[0],
    layers,
    lastLayerEnd,
    reducedMotionProperty: reducedMotionProperties[0],
  };
}

function flattenLayers(source, ast, annotationRanges) {
  const edits = annotationRanges.map((range) => ({ ...range }));

  for (const node of ast.children) {
    if (node.type !== "Atrule" || node.name.toLowerCase() !== "layer") {
      continue;
    }
    if (node.block === null) {
      edits.push({ start: node.loc.start.offset, end: node.loc.end.offset });
      continue;
    }

    edits.push({
      start: node.loc.start.offset,
      end: node.block.loc.start.offset + 1,
    });
    edits.push({
      start: node.block.loc.end.offset - 1,
      end: node.loc.end.offset,
    });
  }

  return applySourceEdits(source, edits).trim() + "\n";
}

function getLayerSource(source, node, annotationRanges) {
  const wrapped = sourceRange(
    source,
    node.loc.start.offset,
    node.loc.end.offset,
    annotationRanges,
  );
  let inner = sourceRange(
    source,
    node.block.loc.start.offset + 1,
    node.block.loc.end.offset - 1,
    annotationRanges,
  );
  if (inner.startsWith("\r\n")) {
    inner = inner.slice(2);
  } else if (inner.startsWith("\n")) {
    inner = inner.slice(1);
  }

  return { inner, wrapped };
}

export function extractCssModules(source, sourcePath = "src/lib/drop-in.css") {
  const analysis = parseModuleSource(source, sourcePath);
  const layers = Object.fromEntries(
    [...analysis.layers].map(([name, node]) => [
      name,
      getLayerSource(source, node, analysis.annotationRanges),
    ]),
  );
  const firstGlobalNode = analysis.ast.children
    .toArray()
    .find((node) => node.loc.start.offset >= analysis.lastLayerEnd);
  const interstitialComments = analysis.comments.filter(
    ({ location }) =>
      location.start.offset >= analysis.lastLayerEnd &&
      location.start.offset < firstGlobalNode.loc.start.offset,
  );
  const globalTailStart = interstitialComments.length
    ? interstitialComments[0].location.start.offset
    : firstGlobalNode.loc.start.offset;
  const conditionalRootAtRules = analysis.canonicalRoot.block.children
    .toArray()
    .filter((node) => node.type === "Atrule")
    .map((node) => generate(node));

  return {
    canonicalRoot: analysis.canonicalRoot,
    conditionalRootAtRules,
    flatSource: flattenLayers(source, analysis.ast, analysis.annotationRanges),
    globalSafetyTail: sourceRange(
      source,
      globalTailStart,
      source.length,
      analysis.annotationRanges,
    ).trim(),
    layerOrder: sourceRange(
      source,
      analysis.layerOrder.loc.start.offset,
      analysis.layerOrder.loc.end.offset,
      analysis.annotationRanges,
    ),
    layers,
    reducedMotionProperty: generate(analysis.reducedMotionProperty),
    source: sourceRange(source, 0, source.length, analysis.annotationRanges),
  };
}
