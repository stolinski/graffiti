import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { generate, parse, tokenize, tokenTypes, walk } from "css-tree";
import { describe, expect, it } from "vitest";

const DIST_DIR = path.resolve(process.cwd(), "dist");

interface CssTreeChildren {
  toArray(): CssTreeNode[];
}

interface CssTreeNode {
  type: string;
  name?: string;
  property?: string;
  value?: CssTreeNode | string;
  prelude?: CssTreeNode | null;
  block?: {
    children: CssTreeChildren;
  } | null;
  children?: CssTreeChildren;
}

function parseCss(css: string, sourceName: string): CssTreeNode {
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

function collectRequiredVarReferences(node: CssTreeNode): Set<string> {
  const references = new Set<string>();

  walk(node, {
    enter(currentNode: CssTreeNode) {
      if (currentNode.type === "Raw" && typeof currentNode.value === "string") {
        for (const reference of collectRawVarReferences(currentNode.value)) {
          if (!reference.hasFallback) references.add(reference.name);
        }
        return;
      }
      if (
        currentNode.type !== "Function" ||
        currentNode.name !== "var" ||
        !currentNode.children
      ) {
        return;
      }

      const children = currentNode.children.toArray();
      const token = children[0];
      const hasFallback = children.some(
        (child) => child.type === "Operator" && child.value === ",",
      );
      if (
        token?.type === "Identifier" &&
        token.name?.startsWith("--") &&
        !hasFallback
      ) {
        references.add(token.name);
      }
    },
  });

  return references;
}

function collectRawVarReferences(
  css: string,
): { name: string; hasFallback: boolean }[] {
  const references: { name: string; hasFallback: boolean }[] = [];
  const functionStack: ({
    isVar: boolean;
    name: string | null;
    hasFallback: boolean;
  } | null)[] = [];

  tokenize(css, (type: number, start: number, end: number) => {
    const value = css.slice(start, end);

    if (type === tokenTypes.Function) {
      functionStack.push({
        isVar: value.toLowerCase() === "var(",
        name: null,
        hasFallback: false,
      });
      return;
    }
    if (type === tokenTypes.LeftParenthesis) {
      functionStack.push(null);
      return;
    }
    if (type === tokenTypes.RightParenthesis) {
      const functionState = functionStack.pop();
      if (functionState?.isVar && functionState.name) {
        references.push({
          name: functionState.name,
          hasFallback: functionState.hasFallback,
        });
      }
      return;
    }

    const functionState = functionStack.at(-1);
    if (!functionState?.isVar) return;
    if (
      type === tokenTypes.Ident &&
      functionState.name === null &&
      value.startsWith("--")
    ) {
      functionState.name = value;
    } else if (type === tokenTypes.Comma) {
      functionState.hasFallback = true;
    }
  });

  return references;
}

function collectRawDeclarations(css: string): Set<string> {
  const declarations = new Set<string>();
  let candidate: string | null = null;

  tokenize(css, (type: number, start: number, end: number) => {
    if (type === tokenTypes.WhiteSpace || type === tokenTypes.Comment) return;

    const value = css.slice(start, end);
    if (type === tokenTypes.Ident && value.startsWith("--")) {
      candidate = value;
      return;
    }
    if (type === tokenTypes.Colon && candidate) declarations.add(candidate);
    candidate = null;
  });

  return declarations;
}

function collectProvidedTokens(ast: CssTreeNode): Set<string> {
  const tokens = new Set<string>();

  walk(ast, {
    enter(node: CssTreeNode) {
      if (node.type === "Raw" && typeof node.value === "string") {
        for (const token of collectRawDeclarations(node.value)) {
          tokens.add(token);
        }
        return;
      }
      if (node.type === "Declaration" && node.property?.startsWith("--")) {
        tokens.add(node.property);
      }
      if (node.type === "Atrule" && node.name === "property" && node.prelude) {
        tokens.add(generate(node.prelude));
      }
    },
  });

  return tokens;
}

function collectCanonicalDeclarations(
  ast: CssTreeNode,
): Map<string, CssTreeNode> {
  let rootRule: CssTreeNode | undefined;

  walk(ast, {
    visit: "Rule",
    enter(node: CssTreeNode) {
      if (!rootRule && node.prelude && generate(node.prelude) === ":root") {
        rootRule = node;
      }
    },
  });

  if (!rootRule?.block) {
    throw new Error("Canonical :root declarations not found in dist/core.css");
  }

  const declarations = new Map<string, CssTreeNode>();
  for (const node of rootRule.block.children.toArray()) {
    if (
      node.type === "Declaration" &&
      node.property?.startsWith("--") &&
      typeof node.value === "object"
    ) {
      declarations.set(node.property, node.value);
    }
  }

  return declarations;
}

function findDependencyCycle(
  graph: ReadonlyMap<string, ReadonlySet<string>>,
): string[] {
  const visited = new Set<string>();
  const active = new Set<string>();
  const path: string[] = [];

  function visit(token: string): string[] {
    if (active.has(token)) {
      return [...path.slice(path.indexOf(token)), token];
    }
    if (visited.has(token)) return [];

    active.add(token);
    path.push(token);
    for (const dependency of graph.get(token) ?? []) {
      const cycle = visit(dependency);
      if (cycle.length > 0) return cycle;
    }
    path.pop();
    active.delete(token);
    visited.add(token);
    return [];
  }

  for (const token of graph.keys()) {
    const cycle = visit(token);
    if (cycle.length > 0) return cycle;
  }
  return [];
}

async function listCssFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const filePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listCssFiles(filePath);
      return entry.name.endsWith(".css") ? [filePath] : [];
    }),
  );

  return files.flat().sort();
}

describe("standalone token dependencies", () => {
  it("keeps the canonical token graph known and acyclic", async () => {
    const coreCss = await readFile(path.join(DIST_DIR, "core.css"), "utf8");
    const declarations = collectCanonicalDeclarations(
      parseCss(coreCss, "dist/core.css"),
    );
    const graph = new Map<string, Set<string>>();
    const unknownTokens = new Set<string>();

    for (const [token, value] of declarations) {
      const dependencies = collectRequiredVarReferences(value);
      graph.set(token, dependencies);
      for (const dependency of dependencies) {
        if (!declarations.has(dependency)) unknownTokens.add(dependency);
      }
    }

    expect([...unknownTokens].sort()).toEqual([]);
    expect(findDependencyCycle(graph)).toEqual([]);
  });

  it("resolves required Graffiti tokens in every dist CSS output", async () => {
    const coreCss = await readFile(path.join(DIST_DIR, "core.css"), "utf8");
    const canonicalTokens = new Set(
      collectCanonicalDeclarations(parseCss(coreCss, "dist/core.css")).keys(),
    );
    const cssFiles = await listCssFiles(DIST_DIR);

    for (const filePath of cssFiles) {
      const relativePath = path.relative(DIST_DIR, filePath);
      const css = await readFile(filePath, "utf8");
      const ast = parseCss(css, `dist/${relativePath}`);
      const providedTokens = collectProvidedTokens(ast);

      // Theme presets are additive by contract and consume core tokens.
      if (relativePath.startsWith(`themes${path.sep}`)) {
        for (const token of canonicalTokens) providedTokens.add(token);
      }

      const unresolvedTokens = [...collectRequiredVarReferences(ast)].filter(
        (token) => !providedTokens.has(token),
      );

      expect(
        unresolvedTokens.sort(),
        `dist/${relativePath} has unresolved var() references without fallbacks`,
      ).toEqual([]);
    }
  });
});
