import { buildDocsContentGraph, parseTopicMarkdown } from "./topics.js";

/** @type {ReturnType<typeof buildDocsContentGraph> | null} */
let cachedGraph = null;

const topicModules = import.meta.glob("./topics/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function loadTopicsFromModules() {
  return Object.entries(topicModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([modulePath, source]) => {
      if (typeof source !== "string") {
        throw new Error(`Expected raw markdown source from ${modulePath}`);
      }

      return parseTopicMarkdown(source, modulePath);
    });
}

export function getDocsContentGraph() {
  if (cachedGraph) {
    return cachedGraph;
  }

  const topics = loadTopicsFromModules();
  cachedGraph = buildDocsContentGraph(topics);
  return cachedGraph;
}

/** @param {string} routeKey */
export function getTopicsForRoute(routeKey) {
  return getDocsContentGraph().byRoute.get(routeKey) ?? [];
}

export function clearDocsContentGraphCache() {
  cachedGraph = null;
}
