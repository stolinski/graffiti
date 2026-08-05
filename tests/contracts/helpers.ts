import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { generate, parse, walk } from "css-tree";
import { expect } from "vitest";

const DIST_DIR = path.resolve(process.cwd(), "dist");
const WORKSPACE_DIR = path.resolve(process.cwd());

export const DIST_FILES = {
  index: "index.css",
  indexMin: "index.min.css",
  flat: "drop-in.css",
  flatMin: "drop-in.min.css",
  core: "core.css",
  utilities: "utilities.css",
  layouts: "layouts.css",
  components: "components.css",
  minimal: "minimal.css",
  standard: "standard.css",
} as const;

interface CssTreeChildren {
  forEach(callback: (node: CssTreeNode) => void): void;
}

interface CssTreeNode {
  type: string;
  name?: string;
  property?: string;
  important?: boolean;
  value?: CssTreeNode | string;
  prelude?: CssTreeNode | null;
  block?: {
    children: CssTreeChildren;
  } | null;
  children?: CssTreeChildren;
}

export interface CssRuleContract {
  selector: string;
  selectors: string[];
  classNames: ReadonlySet<string>;
  idNames: ReadonlySet<string>;
  layer: string | null;
  atRules: readonly CssAtRuleContract[];
  declarations: ReadonlyMap<string, string>;
  declarationList: readonly CssPropertyContract[];
}

export interface CssPropertyContract {
  property: string;
  value: string;
  important: boolean;
}

export interface CssAtRuleContract {
  name: string;
  prelude: string;
}

export interface CssDeclarationContract {
  property: string;
  value: string;
  selector: string | null;
  layer: string | null;
  atRules: readonly CssAtRuleContract[];
  identifiers: ReadonlySet<string>;
  important: boolean;
}

export interface CssVariableReference {
  property: string;
  variable: string;
  hasFallback: boolean;
}

export interface CssVariableContract {
  definitions: ReadonlySet<string>;
  references: readonly CssVariableReference[];
}

export const resolveDistFile = (fileName: string): string =>
  path.join(DIST_DIR, fileName);

export const resolveWorkspaceFile = (fileName: string): string =>
  path.join(WORKSPACE_DIR, fileName);

export async function readDistCss(fileName: string): Promise<string> {
  const filePath = resolveDistFile(fileName);

  await expect(access(filePath)).resolves.toBeUndefined();

  return readFile(filePath, "utf8");
}

export async function readWorkspaceFile(fileName: string): Promise<string> {
  const filePath = resolveWorkspaceFile(fileName);

  await expect(access(filePath)).resolves.toBeUndefined();

  return readFile(filePath, "utf8");
}

export function getLayerOrders(css: string, sourceName: string): string[][] {
  const ast = parseCss(css, sourceName);
  const layerOrders: string[][] = [];

  walk(ast, {
    visit: "Atrule",
    enter(node: CssTreeNode) {
      if (node.name === "layer" && !node.block && node.prelude) {
        layerOrders.push(
          generate(node.prelude)
            .split(",")
            .map((layer: string) => layer.trim()),
        );
      }
    },
  });

  return layerOrders;
}

export function getCssRules(
  css: string,
  sourceName: string,
): CssRuleContract[] {
  const ast = parseCss(css, sourceName);
  const rules: CssRuleContract[] = [];
  const atRuleStack: CssAtRuleContract[] = [];

  walk(ast, {
    enter(node: CssTreeNode) {
      if (isBlockAtRule(node)) {
        atRuleStack.push({
          name: node.name,
          prelude: node.prelude ? generate(node.prelude) : "",
        });
      }

      if (node.type !== "Rule" || !node.prelude || !node.block) {
        return;
      }

      const declarations = new Map<string, string>();
      const declarationList: CssPropertyContract[] = [];
      node.block.children.forEach((child) => {
        if (
          child.type === "Declaration" &&
          child.property &&
          child.value &&
          typeof child.value !== "string"
        ) {
          const value = generate(child.value);
          declarations.set(child.property, value);
          declarationList.push({
            property: child.property,
            value,
            important: child.important === true,
          });
        }
      });

      rules.push({
        selector: generate(node.prelude),
        selectors: getSelectors(node.prelude),
        classNames: getClassNames(node.prelude),
        idNames: getIdNames(node.prelude),
        layer: getCurrentLayer(atRuleStack),
        atRules: [...atRuleStack],
        declarations,
        declarationList,
      });
    },
    leave(node: CssTreeNode) {
      if (isBlockAtRule(node)) {
        atRuleStack.pop();
      }
    },
  });

  return rules;
}

export function getCssDeclarations(
  css: string,
  sourceName: string,
): CssDeclarationContract[] {
  const ast = parseCss(css, sourceName);
  const declarations: CssDeclarationContract[] = [];
  const atRuleStack: CssAtRuleContract[] = [];
  const selectorStack: string[] = [];

  walk(ast, {
    enter(node: CssTreeNode) {
      if (isBlockAtRule(node)) {
        atRuleStack.push({
          name: node.name,
          prelude: node.prelude ? generate(node.prelude) : "",
        });
      }

      if (node.type === "Rule" && node.prelude) {
        selectorStack.push(generate(node.prelude));
      }

      if (
        node.type !== "Declaration" ||
        !node.property ||
        !node.value ||
        typeof node.value === "string"
      ) {
        return;
      }

      declarations.push({
        property: node.property,
        value: generate(node.value),
        selector: selectorStack.at(-1) ?? null,
        layer: getCurrentLayer(atRuleStack),
        atRules: [...atRuleStack],
        identifiers: getIdentifiers(node.value),
        important: node.important === true,
      });
    },
    leave(node: CssTreeNode) {
      if (node.type === "Rule" && node.prelude) {
        selectorStack.pop();
      }

      if (isBlockAtRule(node)) {
        atRuleStack.pop();
      }
    },
  });

  return declarations;
}

export function getCssVariableContract(
  css: string,
  sourceName: string,
): CssVariableContract {
  const ast = parseCss(css, sourceName);
  const definitions = new Set<string>();
  const references: CssVariableReference[] = [];

  walk(ast, {
    enter(node: CssTreeNode) {
      if (node.type === "Atrule" && node.name === "property" && node.prelude) {
        definitions.add(generate(node.prelude));
      }

      if (
        node.type !== "Declaration" ||
        !node.property ||
        !node.value ||
        typeof node.value === "string"
      ) {
        return;
      }

      if (node.property.startsWith("--")) {
        definitions.add(node.property);
      }

      walk(parseDeclarationValue(node.value), {
        visit: "Function",
        enter(functionNode: CssTreeNode) {
          if (functionNode.name !== "var" || !functionNode.children) {
            return;
          }

          let variable: string | null = null;
          let hasFallback = false;
          functionNode.children.forEach((child) => {
            if (
              variable === null &&
              child.type === "Identifier" &&
              child.name?.startsWith("--")
            ) {
              variable = child.name;
            }
            if (child.type === "Operator" && child.value === ",") {
              hasFallback = true;
            }
          });

          if (variable) {
            references.push({
              property: node.property,
              variable,
              hasFallback,
            });
          }
        },
      });
    },
  });

  return { definitions, references };
}

export function getCssImports(css: string, sourceName: string): string[] {
  const ast = parseCss(css, sourceName);
  const imports: string[] = [];

  walk(ast, {
    visit: "Atrule",
    enter(node: CssTreeNode) {
      if (node.name !== "import" || !node.prelude) {
        return;
      }

      walk(node.prelude, {
        enter(importNode: CssTreeNode) {
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

  return imports;
}

export function normalizeCss(css: string, sourceName: string): string {
  return generate(parseCss(css, sourceName));
}

function parseCss(css: string, sourceName: string): CssTreeNode {
  try {
    return parse(css, { filename: sourceName, positions: true });
  } catch (error) {
    throw new Error(`Failed to parse ${sourceName}`, { cause: error });
  }
}

function isBlockAtRule(node: CssTreeNode): node is CssTreeNode & {
  name: string;
  block: NonNullable<CssTreeNode["block"]>;
} {
  return (
    node.type === "Atrule" &&
    node.name !== undefined &&
    node.block !== null &&
    node.block !== undefined
  );
}

function getCurrentLayer(atRules: readonly CssAtRuleContract[]): string | null {
  for (let index = atRules.length - 1; index >= 0; index -= 1) {
    const atRule = atRules[index];
    if (atRule?.name === "layer") {
      return atRule.prelude;
    }
  }

  return null;
}

function getSelectors(prelude: CssTreeNode): string[] {
  if (prelude.type !== "SelectorList" || !prelude.children) {
    return [generate(prelude)];
  }

  const selectors: string[] = [];
  prelude.children.forEach((selector) => selectors.push(generate(selector)));
  return selectors;
}

function getClassNames(prelude: CssTreeNode): ReadonlySet<string> {
  const classNames = new Set<string>();

  walk(prelude, {
    visit: "ClassSelector",
    enter(node: CssTreeNode) {
      if (node.name) {
        classNames.add(node.name);
      }
    },
  });

  return classNames;
}

function getIdNames(prelude: CssTreeNode): ReadonlySet<string> {
  const idNames = new Set<string>();

  walk(prelude, {
    visit: "IdSelector",
    enter(node: CssTreeNode) {
      if (node.name) {
        idNames.add(node.name);
      }
    },
  });

  return idNames;
}

function getIdentifiers(value: CssTreeNode): ReadonlySet<string> {
  const identifiers = new Set<string>();

  walk(parseDeclarationValue(value), {
    visit: "Identifier",
    enter(node: CssTreeNode) {
      if (node.name) {
        identifiers.add(node.name);
      }
    },
  });

  return identifiers;
}

function parseDeclarationValue(value: CssTreeNode): CssTreeNode {
  return value.type === "Raw"
    ? parse(generate(value), { context: "value" })
    : value;
}
