import { parseMarkdownDocument } from "./frontmatter.js";
import { normalizeRouteIntroRecord } from "./routes/schema.js";
import { buildDocsContentGraph, parseTopicMarkdown } from "./topics.js";

/** @type {ReturnType<typeof buildDocsContentGraph> | null} */
let cachedGraph = null;

/** @type {Map<string, ReturnType<typeof normalizeRouteIntroRecord>> | null} */
let cachedRouteIntroMap = null;

const topicModules = import.meta.glob("./topics/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const routeIntroModules = import.meta.glob("./routes/*.md", {
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

/** @param {string} modulePath */
function routeKeyFromModulePath(modulePath) {
  const match = modulePath.match(/^\.\/routes\/([a-z0-9-]+)\.md$/);
  if (!match) {
    throw new Error(`Invalid route intro module path: ${modulePath}`);
  }

  return match[1];
}

function loadRouteIntrosFromModules() {
  return Object.entries(routeIntroModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([modulePath, source]) => {
      if (typeof source !== "string") {
        throw new Error(`Expected raw markdown source from ${modulePath}`);
      }

      const routeKey = routeKeyFromModulePath(modulePath);
      const { frontmatter, body } = parseMarkdownDocument(source, modulePath);
      return normalizeRouteIntroRecord(frontmatter, body, routeKey, modulePath);
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

export function getRouteIntroMap() {
  if (cachedRouteIntroMap) {
    return cachedRouteIntroMap;
  }

  const routeIntros = loadRouteIntrosFromModules();
  cachedRouteIntroMap = new Map(routeIntros.map((intro) => [intro.key, intro]));
  return cachedRouteIntroMap;
}

/** @param {string} routeKey */
export function getRouteIntro(routeKey) {
  return getRouteIntroMap().get(routeKey);
}

/** @param {string} routeKey */
export function getTopicsForRoute(routeKey) {
  return getDocsContentGraph().byRoute.get(routeKey) ?? [];
}

export function clearDocsContentGraphCache() {
  cachedGraph = null;
  cachedRouteIntroMap = null;
}
