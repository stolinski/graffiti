import { parseMarkdownDocument } from "./frontmatter.js";
import {
  DOCS_ROUTE_KEYS,
  docsRoutePath,
  normalizeTopicRecord,
} from "./schema.js";

const ROUTE_ORDER = new Map(DOCS_ROUTE_KEYS.map((key, index) => [key, index]));

/** @param {string} source @param {string} sourcePath */
export function parseTopicMarkdown(source, sourcePath = "<unknown>") {
  const { frontmatter, body } = parseMarkdownDocument(source, sourcePath);
  return normalizeTopicRecord(frontmatter, body, sourcePath);
}

/** @param {ReturnType<typeof parseTopicMarkdown>[]} topics */
export function sortTopics(topics) {
  return [...topics].sort((a, b) => {
    const routeDelta =
      (ROUTE_ORDER.get(a.route) ?? Number.MAX_SAFE_INTEGER) -
      (ROUTE_ORDER.get(b.route) ?? Number.MAX_SAFE_INTEGER);

    if (routeDelta !== 0) return routeDelta;
    if (a.order !== b.order) return a.order - b.order;
    return a.id.localeCompare(b.id);
  });
}

/** @param {ReturnType<typeof parseTopicMarkdown>[]} topics */
export function buildDocsContentGraph(topics) {
  const sortedTopics = sortTopics(topics);

  /** @type {Map<string, ReturnType<typeof parseTopicMarkdown>[]>} */
  const byRoute = new Map();
  for (const routeKey of DOCS_ROUTE_KEYS) {
    byRoute.set(routeKey, []);
  }

  /** @type {Map<string, ReturnType<typeof parseTopicMarkdown>>} */
  const byId = new Map();

  for (const topic of sortedTopics) {
    const existingById = byId.get(topic.id);
    if (existingById) {
      throw new Error(
        `Duplicate topic id "${topic.id}" in ${topic.sourcePath} and ${existingById.sourcePath}`,
      );
    }

    byId.set(topic.id, topic);

    const routeTopics = byRoute.get(topic.route);
    if (!routeTopics) {
      throw new Error(
        `Topic route "${topic.route}" has no route bucket (${topic.sourcePath})`,
      );
    }

    routeTopics.push(topic);
  }

  const routes = DOCS_ROUTE_KEYS.map((routeKey) => ({
    key: routeKey,
    path: docsRoutePath(routeKey),
    topics: byRoute.get(routeKey) ?? [],
  }));

  return {
    topics: sortedTopics,
    byRoute,
    byId,
    routes,
  };
}
