import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DOCS_ROUTE_KEYS } from "../src/docs/content/schema.js";
import {
  buildDocsContentGraph,
  parseTopicMarkdown,
} from "../src/docs/content/topics.js";

const filePath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(filePath);
const root = path.resolve(scriptDir, "..");

const topicsDir = path.join(root, "src/docs/content/topics");
const demosDir = path.join(root, "src/docs/demos");

const topicFiles = (await readdir(topicsDir))
  .filter((file) => file.endsWith(".md"))
  .sort((a, b) => a.localeCompare(b));

const demoFiles = (await readdir(demosDir))
  .filter((file) => file.endsWith(".svelte"))
  .sort((a, b) => a.localeCompare(b));

const validDemoIds = new Set(
  demoFiles.map((file) => file.replace(/\.svelte$/, "")),
);

/** @type {ReturnType<typeof parseTopicMarkdown>[]} */
const topics = [];
const errors = [];

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
  `Docs content check passed (${graph.topics.length} topics, ${demoFiles.length} demos, routes ${routeSummary}).`,
);
