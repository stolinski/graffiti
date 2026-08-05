import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createServer } from "vite";

const filePath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(filePath);
const root = path.resolve(scriptDir, "..");
const outputDir = path.join(root, "static/llms/generated");

/** @typedef {{ slug: string }} AgentSection */
/** @typedef {{ slug: string }} RouteGuide */

await mkdir(outputDir, { recursive: true });

const vite = await createServer({
  appType: "custom",
  configFile: false,
  logLevel: "error",
  root,
  server: { middlewareMode: true },
});

/** @type {Array<[string, string]>} */
let outputs = [];

try {
  const manifest = await vite.ssrLoadModule("/src/docs/agent/manifest.js");
  const markdown = await vite.ssrLoadModule("/src/docs/agent/markdown.js");
  const agentSections = /** @type {AgentSection[]} */ (manifest.agentSections);
  const docsRouteGuides = /** @type {RouteGuide[]} */ (
    manifest.docsRouteGuides
  );
  const renderAgentIndexMarkdown = /** @type {() => string} */ (
    markdown.renderAgentIndexMarkdown
  );
  const renderAgentSectionMarkdown =
    /** @type {(section: AgentSection) => string} */ (
      markdown.renderAgentSectionMarkdown
    );
  const renderRouteGuideMarkdown =
    /** @type {(guide: RouteGuide) => string} */ (
      markdown.renderRouteGuideMarkdown
    );

  outputs = [
    ["index.md", renderAgentIndexMarkdown()],
    ...agentSections.map((section) => [
      `${section.slug}.md`,
      renderAgentSectionMarkdown(section),
    ]),
    ...docsRouteGuides.map((guide) => [
      `${guide.slug}.md`,
      renderRouteGuideMarkdown(guide),
    ]),
  ];
} finally {
  await vite.close();
}

await Promise.all(
  outputs.map(([filename, markdown]) =>
    writeFile(path.join(outputDir, filename), `${markdown.trim()}\n`),
  ),
);

console.log(`Generated ${outputs.length} files in static/llms/generated`);
