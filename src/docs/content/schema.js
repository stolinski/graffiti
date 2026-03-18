export const DOCS_ROUTE_KEYS = [
  "base",
  "utilities",
  "elements",
  "ui-blocks",
  "changelog",
];

const DOCS_ROUTE_SET = new Set(DOCS_ROUTE_KEYS);
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

/** @param {Record<string, unknown>} record @param {string[]} keys */
function pickValue(record, keys) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      return record[key];
    }
  }

  return undefined;
}

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

/** @param {unknown} value @param {string} key @param {string} sourcePath */
function optionalStringArray(value, key, sourcePath) {
  if (value == null || value === "") {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`Expected array for "${key}" in ${sourcePath}`);
  }

  return value.map((item, index) => {
    if (typeof item !== "string") {
      throw new Error(`Expected string at ${key}[${index}] in ${sourcePath}`);
    }

    const trimmed = item.trim();
    if (!trimmed) {
      throw new Error(`Expected non-empty ${key}[${index}] in ${sourcePath}`);
    }

    return trimmed;
  });
}

/** @param {unknown} value @param {string} key @param {string} sourcePath */
function requireInteger(value, key, sourcePath) {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  if (!Number.isInteger(numeric)) {
    throw new Error(`Expected integer for "${key}" in ${sourcePath}`);
  }

  return numeric;
}

/** @param {string} value @param {string} key @param {string} sourcePath */
function requireSlug(value, key, sourcePath) {
  if (!SLUG_PATTERN.test(value)) {
    throw new Error(
      `Expected ${key} to match ${SLUG_PATTERN} in ${sourcePath}; got "${value}"`,
    );
  }

  return value;
}

/** @param {string} routeKey */
export function docsRoutePath(routeKey) {
  return `/${routeKey}`;
}

/**
 * @param {Record<string, unknown>} frontmatter
 * @param {string} body
 * @param {string} sourcePath
 */
export function normalizeTopicRecord(
  frontmatter,
  body,
  sourcePath = "<unknown>",
) {
  const id = requireSlug(
    requireString(frontmatter.id, "id", sourcePath),
    "id",
    sourcePath,
  );

  const title = requireString(frontmatter.title, "title", sourcePath);

  const route = requireString(frontmatter.route, "route", sourcePath).replace(
    /^\//,
    "",
  );

  if (!DOCS_ROUTE_SET.has(route)) {
    throw new Error(
      `Unsupported route "${route}" in ${sourcePath}. Expected one of: ${DOCS_ROUTE_KEYS.join(", ")}`,
    );
  }

  const summary = requireString(frontmatter.summary, "summary", sourcePath);

  const whenToUse = requireString(
    pickValue(frontmatter, ["when_to_use", "whenToUse"]),
    "when_to_use",
    sourcePath,
  );

  const order = requireInteger(frontmatter.order, "order", sourcePath);

  const classes = optionalStringArray(
    frontmatter.classes,
    "classes",
    sourcePath,
  );
  const demos = optionalStringArray(frontmatter.demos, "demos", sourcePath);
  const tags = optionalStringArray(frontmatter.tags, "tags", sourcePath);

  const markdown = body.trim();
  if (!markdown) {
    throw new Error(`Expected markdown body content in ${sourcePath}`);
  }

  return {
    id,
    title,
    route,
    summary,
    whenToUse,
    order,
    classes,
    demos,
    tags,
    markdown,
    sourcePath,
  };
}
