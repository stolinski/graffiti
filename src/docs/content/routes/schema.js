import { DOCS_ROUTE_KEYS } from "../schema.js";

export const ROUTE_INTRO_KEYS = DOCS_ROUTE_KEYS.filter(
  (routeKey) => routeKey !== "changelog",
);

const ROUTE_INTRO_SET = new Set(ROUTE_INTRO_KEYS);

/** @param {unknown} value @param {string} key @param {string} sourcePath */
function requireString(value, key, sourcePath) {
  if (typeof value !== "string") {
    throw new Error(`Expected string for "${key}" in ${sourcePath}`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`Expected non-empty string for "${key}" in ${sourcePath}`);
  }

  return trimmed;
}

/** @param {string} routeKey */
export function isRouteIntroKey(routeKey) {
  return ROUTE_INTRO_SET.has(routeKey);
}

/**
 * @param {Record<string, unknown>} frontmatter
 * @param {string} body
 * @param {string} routeKey
 * @param {string} sourcePath
 */
export function normalizeRouteIntroRecord(
  frontmatter,
  body,
  routeKey,
  sourcePath = "<unknown>",
) {
  if (!isRouteIntroKey(routeKey)) {
    throw new Error(
      `Unsupported route intro key "${routeKey}" in ${sourcePath}. Expected one of: ${ROUTE_INTRO_KEYS.join(", ")}`,
    );
  }

  const title = requireString(frontmatter.title, "title", sourcePath);
  const tagline = requireString(frontmatter.tagline, "tagline", sourcePath);

  const markdown = body.trim();
  if (!markdown) {
    throw new Error(`Expected markdown body content in ${sourcePath}`);
  }

  return {
    key: routeKey,
    title,
    tagline,
    markdown,
    sourcePath,
  };
}
