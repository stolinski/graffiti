import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { agentSections, docsRouteGuides } from "../src/docs/agent/manifest.js";
import {
  renderAgentIndexMarkdown,
  renderAgentSectionMarkdown,
  renderRouteGuideMarkdown,
} from "../src/docs/agent/markdown.js";

const filePath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(filePath);
const root = path.resolve(scriptDir, "..");
const outputDir = path.join(root, "static/llms/generated");

await mkdir(outputDir, { recursive: true });

const outputs = [
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

await Promise.all(
  outputs.map(([filename, markdown]) =>
    writeFile(path.join(outputDir, filename), `${markdown.trim()}\n`),
  ),
);

console.log(`Generated ${outputs.length} files in static/llms/generated`);
