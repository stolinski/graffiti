import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parseMarkdownDocument } from "../src/docs/content/frontmatter.js";
import {
  ROUTE_INTRO_KEYS,
  normalizeRouteIntroRecord,
} from "../src/docs/content/routes/schema.js";
import { DOCS_ROUTE_KEYS } from "../src/docs/content/schema.js";
import {
  buildDocsContentGraph,
  parseTopicMarkdown,
} from "../src/docs/content/topics.js";

const filePath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(filePath);
const root = path.resolve(scriptDir, "..");

const topicsDir = path.join(root, "src/docs/content/topics");
const routeIntrosDir = path.join(root, "src/docs/content/routes");
const demosDir = path.join(root, "src/docs/demos");

const topicFiles = (await readdir(topicsDir))
  .filter((file) => file.endsWith(".md"))
  .sort((a, b) => a.localeCompare(b));

const demoFiles = (await readdir(demosDir))
  .filter((file) => file.endsWith(".svelte"))
  .sort((a, b) => a.localeCompare(b));

const routeIntroFiles = (await readdir(routeIntrosDir))
  .filter((file) => file.endsWith(".md"))
  .sort((a, b) => a.localeCompare(b));

const validDemoIds = new Set(
  demoFiles.map((file) => file.replace(/\.svelte$/, "")),
);

/** @type {ReturnType<typeof parseTopicMarkdown>[]} */
const topics = [];
const errors = [];

const routeIntroKeysSeen = new Set();

if (topicFiles.length === 0) {
  errors.push("No topic markdown files found in src/docs/content/topics");
}

for (const file of topicFiles) {
  const fullPath = path.join(topicsDir, file);
  const relativePath = path.relative(root, fullPath);

  let source;
  try {
    source = await readFile(fullPath, "utf8");
  } catch (error) {
    errors.push(`Unable to read ${relativePath}: ${String(error)}`);
    continue;
  }

  let topic;
  try {
    topic = parseTopicMarkdown(source, relativePath);
  } catch (error) {
    errors.push(String(error));
    continue;
  }

  topics.push(topic);

  for (const demoId of topic.demos) {
    if (!validDemoIds.has(demoId)) {
      errors.push(
        `Missing demo "${demoId}" referenced by ${relativePath}; expected src/docs/demos/${demoId}.svelte`,
      );
    }
  }
}

if (routeIntroFiles.length === 0) {
  errors.push("No route intro markdown files found in src/docs/content/routes");
}

for (const file of routeIntroFiles) {
  const fullPath = path.join(routeIntrosDir, file);
  const relativePath = path.relative(root, fullPath);
  const routeKey = file.replace(/\.md$/, "");

  let source;
  try {
    source = await readFile(fullPath, "utf8");
  } catch (error) {
    errors.push(`Unable to read ${relativePath}: ${String(error)}`);
    continue;
  }

  try {
    const { frontmatter, body } = parseMarkdownDocument(source, relativePath);
    const routeIntro = normalizeRouteIntroRecord(
      frontmatter,
      body,
      routeKey,
      relativePath,
    );

    if (routeIntroKeysSeen.has(routeIntro.key)) {
      errors.push(
        `Duplicate route intro key "${routeIntro.key}" in ${relativePath}`,
      );
      continue;
    }

    routeIntroKeysSeen.add(routeIntro.key);
  } catch (error) {
    errors.push(String(error));
  }
}

for (const routeKey of ROUTE_INTRO_KEYS) {
  if (!routeIntroKeysSeen.has(routeKey)) {
    errors.push(
      `Missing route intro markdown for "${routeKey}" in src/docs/content/routes/${routeKey}.md`,
    );
  }
}

let graph = null;
if (errors.length === 0) {
  try {
    graph = buildDocsContentGraph(topics);
  } catch (error) {
    errors.push(String(error));
  }
}

if (errors.length > 0) {
  console.error("Docs content check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

if (!graph) {
  console.error("Docs content check failed: no content graph produced.");
  process.exit(1);
}

const routeSummary = DOCS_ROUTE_KEYS.map(
  (routeKey) => `${routeKey}:${graph.byRoute.get(routeKey)?.length ?? 0}`,
).join(", ");

console.log(
  `Docs content check passed (${graph.topics.length} topics, ${demoFiles.length} demos, ${routeIntroKeysSeen.size} route intros, routes ${routeSummary}).`,
);
