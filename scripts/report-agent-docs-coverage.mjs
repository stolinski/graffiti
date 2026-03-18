import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { agentSections, docsRouteGuides } from "../src/docs/agent/manifest.js";

const filePath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(filePath);
const root = path.resolve(scriptDir, "..");

function routeFileForPath(routePath) {
  if (routePath === "/") {
    return path.join(root, "src/routes/(docs)/+page.svelte");
  }

  const slug = routePath.replace(/^\//, "");
  return path.join(root, `src/routes/(docs)/${slug}/+page.svelte`);
}

function stripTags(text) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(source) {
  const headingPattern = /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g;
  const headings = [];

  for (const match of source.matchAll(headingPattern)) {
    const level = Number(match[1]);
    const attrs = match[2] ?? "";
    const rawText = match[3] ?? "";
    const idMatch = attrs.match(/id=["']([^"']+)["']/);

    headings.push({
      level,
      text: stripTags(rawText),
      id: idMatch ? idMatch[1] : null,
    });
  }

  return headings;
}

function summarizeTopic(topic) {
  const ref = topic.llmsFile
    ? `llms/${topic.llmsFile}`
    : `route anchor ${topic.routeAnchor}`;
  return `- ${topic.title} -> ${ref}`;
}

async function sectionReport(section) {
  const file = routeFileForPath(section.routePath);
  const source = await readFile(file, "utf8");
  const headings = extractHeadings(source);

  const routeIds = new Set(headings.map((item) => item.id).filter(Boolean));
  const referencedAnchors = new Set(
    section.usageOrder
      .map((topic) => topic.routeAnchor)
      .filter((anchor) => anchor && anchor.startsWith("#"))
      .map((anchor) => anchor.slice(1)),
  );

  const uncoveredRouteIds = [...routeIds]
    .filter((id) => !referencedAnchors.has(id))
    .sort();

  return {
    section,
    file,
    headings,
    uncoveredRouteIds,
  };
}

const reports = await Promise.all(
  agentSections.map((section) => sectionReport(section)),
);

const guideLines = docsRouteGuides
  .map(
    (guide) =>
      `- ${guide.title} (${guide.routePath}) with ${guide.topLinks.length} reference links`,
  )
  .join("\n");

const reportBody = reports
  .map(({ section, file, headings, uncoveredRouteIds }) => {
    const headingLines = headings
      .map(
        (item) =>
          `- h${item.level}${item.id ? `#${item.id}` : ""}: ${item.text}`,
      )
      .join("\n");

    const topicLines = section.usageOrder
      .map((topic) => summarizeTopic(topic))
      .join("\n");

    const uncovered =
      uncoveredRouteIds.length > 0
        ? uncoveredRouteIds.map((id) => `- ${id}`).join("\n")
        : "- none";

    return `## ${section.title} (${section.routePath})\n\n- Route file: ${path.relative(root, file)}\n- Topic count: ${section.usageOrder.length}\n- Heading count: ${headings.length}\n\n### Topic References\n\n${topicLines}\n\n### Route Headings\n\n${headingLines}\n\n### Uncovered Route IDs (for optional map additions)\n\n${uncovered}`;
  })
  .join("\n\n");

const content = `# Agent Docs Coverage Report\n\nGenerated: ${new Date().toISOString()}\n\n## Summary\n\n- Map-driven sections: ${agentSections.length}\n- Guide-driven routes: ${docsRouteGuides.length}\n\n## Guide Routes\n\n${guideLines || "- none"}\n\n${reportBody}\n`;

const outputDir = path.join(root, "history");
const outputFile = path.join(outputDir, "docs-agent-coverage-latest.md");

await mkdir(outputDir, { recursive: true });
await writeFile(outputFile, content);

console.log(`Wrote ${path.relative(root, outputFile)}`);
