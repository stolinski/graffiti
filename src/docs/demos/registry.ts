const demoModules = import.meta.glob<{ default: unknown }>("./*.svelte");
const demoRawModules = import.meta.glob<string>("./*.svelte", {
  query: "?raw",
  import: "default",
});

export interface DemoEntry {
  component: () => Promise<{ default: unknown }>;
  code: () => Promise<string>;
}

const demoEntries = Object.keys(demoModules)
  .sort((a, b) => a.localeCompare(b))
  .map((path) => {
    const codeLoader = demoRawModules[path];

    if (!codeLoader) {
      throw new Error(`Missing raw demo loader for ${path}`);
    }

    const name = path.replace("./", "").replace(/\.svelte$/, "");
    return [
      name,
      {
        component: demoModules[path],
        code: codeLoader,
      },
    ] as const;
  });

export const demoRegistry: Record<string, DemoEntry> =
  Object.fromEntries(demoEntries);

export function getDemo(name: string): DemoEntry | undefined {
  return demoRegistry[name];
}

export function hasDemo(name: string): boolean {
  return name in demoRegistry;
}
