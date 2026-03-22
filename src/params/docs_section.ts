const DOCS_SECTIONS = new Set(["base", "utilities", "elements", "ui-blocks"]);

export function match(param: string): boolean {
  return DOCS_SECTIONS.has(param);
}
