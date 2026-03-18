/**
 * Parse scalar values in a constrained YAML subset.
 * Supports booleans, numbers, and quoted/unquoted strings.
 * @param {string} rawValue
 */
function parseScalar(rawValue) {
  const value = rawValue.trim();

  if (value === "true") return true;
  if (value === "false") return false;

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

/**
 * Parse a limited frontmatter format.
 *
 * Supported patterns:
 * - key: value
 * - key:
 *   - value
 *   - value
 *
 * Nested objects are intentionally not supported.
 * @param {string} block
 * @param {string} sourcePath
 */
export function parseFrontmatterBlock(block, sourcePath = "<unknown>") {
  /** @type {Record<string, unknown>} */
  const result = {};
  const lines = block.split(/\r?\n/);

  for (let i = 0; i < lines.length; ) {
    const currentLine = lines[i];
    const trimmed = currentLine.trim();

    if (trimmed === "" || trimmed.startsWith("#")) {
      i += 1;
      continue;
    }

    const keyMatch = currentLine.match(/^([A-Za-z0-9_]+):(.*)$/);
    if (!keyMatch) {
      throw new Error(
        `Invalid frontmatter line in ${sourcePath}: "${currentLine}"`,
      );
    }

    const key = keyMatch[1];
    const remainder = keyMatch[2].trim();

    if (remainder.length > 0) {
      result[key] = parseScalar(remainder);
      i += 1;
      continue;
    }

    /** @type {unknown[]} */
    const listValues = [];
    let j = i + 1;
    for (; j < lines.length; j += 1) {
      const line = lines[j];
      const listMatch = line.match(/^\s*-\s+(.+)$/);

      if (listMatch) {
        listValues.push(parseScalar(listMatch[1]));
        continue;
      }

      if (line.trim() === "") {
        continue;
      }

      if (/^\s+/.test(line)) {
        throw new Error(
          `Nested frontmatter values are not supported in ${sourcePath}: "${line}"`,
        );
      }

      break;
    }

    if (listValues.length > 0) {
      result[key] = listValues;
      i = j;
      continue;
    }

    result[key] = "";
    i += 1;
  }

  return result;
}

/**
 * Parse markdown content with required frontmatter.
 * @param {string} source
 * @param {string} sourcePath
 */
export function parseMarkdownDocument(source, sourcePath = "<unknown>") {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(
      `Missing or invalid frontmatter in ${sourcePath}. Expected --- blocks at the top of the file.`,
    );
  }

  const frontmatterBlock = match[1];
  const body = match[2] ?? "";

  return {
    frontmatter: parseFrontmatterBlock(frontmatterBlock, sourcePath),
    body,
  };
}
