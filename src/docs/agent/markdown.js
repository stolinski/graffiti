import { agentSections, docsRouteGuides, siteUrl } from "./manifest.js";
import { getTopicsForRoute } from "$docs/content/runtime.js";

/**
 * @typedef {Object} AgentTopic
 * @property {string} slug
 * @property {string} title
 * @property {string} whenToUse
 * @property {string[]} classes
 * @property {string} routeAnchor
 */

/**
 * @typedef {Object} AgentSection
 * @property {string} slug
 * @property {string} routePath
 * @property {string} title
 * @property {string} summary
 * @property {AgentTopic[]} usageOrder
 */

/**
 * @typedef {Object} RouteGuide
 * @property {string} slug
 * @property {string} routePath
 * @property {string} title
 * @property {string} summary
 * @property {{ label: string, href: string }[]} topLinks
 */

/** @typedef {ReturnType<import("$docs/content/topics.js").parseTopicMarkdown>} RuntimeTopic */

/** @type {AgentSection[]} */
const sections = agentSections;

/** @type {RouteGuide[]} */
const guides = docsRouteGuides;

/** @param {string} pathname */
function normalizePath(pathname) {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

/** @param {string} pathname */
function toAbsolute(pathname) {
  return `${siteUrl}${pathname}`;
}

/** @param {string} routePath */
function routeKeyFromPath(routePath) {
  return routePath.replace(/^\//, "");
}

/** @param {{ title: string, url: string, description: string }} input */
function markdownFrontmatter({ title, url, description }) {
  return `---\ntitle: "${title}"\nurl: ${url}\ndescription: "${description}"\n---`;
}

/**
 * Render a single runtime topic to markdown with full content
 * @param {RuntimeTopic} topic
 */
function renderTopicMarkdown(topic) {
  const classSection =
    topic.classes.length > 0
      ? `**Classes:** ${topic.classes.map((c) => `\`${c}\``).join(", ")}\n\n`
      : "";

  return `## ${topic.title}\n\n${topic.summary}\n\n**When to use:** ${topic.whenToUse}\n\n${classSection}${topic.markdown}\n`;
}

/**
 * Get runtime topics for a section, maintaining manifest order
 * @param {AgentSection} section
 */
function getOrderedRuntimeTopics(section) {
  const runtimeTopics = getTopicsForRoute(routeKeyFromPath(section.routePath));

  // Create a map by ID for quick lookup
  const runtimeById = new Map(runtimeTopics.map((t) => [t.id, t]));

  // Return topics in manifest order, falling back to runtime order for new topics
  const orderedTopics = [];
  const seenIds = new Set();

  // First, add topics in manifest order if they exist in runtime
  for (const manifestTopic of section.usageOrder) {
    const runtime = runtimeById.get(manifestTopic.slug);
    if (runtime) {
      orderedTopics.push(runtime);
      seenIds.add(runtime.id);
    }
  }

  // Then add any runtime topics not in manifest (new topics)
  for (const topic of runtimeTopics) {
    if (!seenIds.has(topic.id)) {
      orderedTopics.push(topic);
    }
  }

  return orderedTopics;
}

/** @param {AgentSection} section */
export function renderAgentSectionMarkdown(section) {
  const frontmatter = markdownFrontmatter({
    title: `Graffiti ${section.title}`,
    url: toAbsolute(section.routePath),
    description: section.summary,
  });

  const runtimeTopics = getOrderedRuntimeTopics(section);

  // Render full topic content inline
  const topicContent = runtimeTopics.map(renderTopicMarkdown).join("\n---\n\n");

  // Quick reference index at the top
  const topicIndex = runtimeTopics
    .map((topic) => {
      const classes =
        topic.classes.length > 0
          ? ` (${topic.classes.slice(0, 3).join(", ")})`
          : "";
      return `- **${topic.title}**${classes} - ${topic.whenToUse}`;
    })
    .join("\n");

  return `${frontmatter}

# Graffiti ${section.title}

${section.summary}

## Quick Reference

${topicIndex}

---

${topicContent}`;
}

/** @param {RouteGuide} guide */
export function renderRouteGuideMarkdown(guide) {
  const frontmatter = markdownFrontmatter({
    title: `Graffiti ${guide.title}`,
    url: toAbsolute(guide.routePath),
    description: guide.summary,
  });

  const links = guide.topLinks
    .map((item) => `- [${item.label}](${toAbsolute(item.href)})`)
    .join("\n");

  return `${frontmatter}

# ${guide.title}

${guide.summary}

## References

${links}
`;
}

export function renderAgentIndexMarkdown() {
  const frontmatter = markdownFrontmatter({
    title: "Graffiti CSS Framework",
    url: toAbsolute("/"),
    description:
      "A minimal, drop-in CSS toolkit with fluid typography, modern CSS features, and zero JavaScript dependencies.",
  });

  const sectionLinks = sections
    .map(
      (section) =>
        `- [${section.title}](${toAbsolute(section.routePath)}) - ${section.summary}`,
    )
    .join("\n");

  const guideLinks = guides
    .map(
      (guide) =>
        `- [${guide.title}](${toAbsolute(guide.routePath)}) - ${guide.summary}`,
    )
    .join("\n");

  return `${frontmatter}

# Graffiti CSS Framework

A minimal, drop-in CSS toolkit with fluid typography, modern CSS features, and zero JavaScript dependencies.

## Installation

\`\`\`bash
npm install @drop-in/graffiti
\`\`\`

## Import Options

\`\`\`js
// Full framework (~75KB)
import '@drop-in/graffiti'

// Minimal - core + utilities only (~26KB)
import '@drop-in/graffiti/minimal'

// Standard - core + utilities + layouts (~33KB)
import '@drop-in/graffiti/standard'
\`\`\`

## Documentation Sections

${sectionLinks}

${guideLinks.length > 0 ? `## Guides\n\n${guideLinks}` : ""}

## Philosophy

Graffiti styles native HTML elements directly - no component library, no JavaScript framework required. It uses modern CSS features like OKLCH colors, container queries, CSS scroll-snap, and the popover/dialog APIs.

**Key principles:**
- **Native HTML first** - Use \`<dialog>\`, \`<details>\`, \`popover\`, HTML invokers before reaching for JS
- **Minimal classes** - Most elements are styled automatically, add classes only when needed
- **CSS custom properties** - Customize colors, spacing, and sizing via variables
- **Fluid typography** - Text scales smoothly between viewport sizes
- **Automatic theming** - Light/dark mode via \`light-dark()\` with no extra work

Request any section route with \`Accept: text/markdown\` header to get full documentation.
`;
}

const sectionByPath = new Map(
  sections.map((section) => [normalizePath(section.routePath), section]),
);

const guideByPath = new Map(
  guides.map((guide) => [normalizePath(guide.routePath), guide]),
);

/** @param {string} pathname */
export function getAgentMarkdownForPath(pathname) {
  const normalizedPath = normalizePath(pathname);

  if (normalizedPath === "/") {
    return renderAgentIndexMarkdown();
  }

  const section = sectionByPath.get(normalizedPath);
  if (section) {
    return renderAgentSectionMarkdown(section);
  }

  const guide = guideByPath.get(normalizedPath);
  if (guide) {
    return renderRouteGuideMarkdown(guide);
  }

  return null;
}

/** @param {string | null} acceptHeader */
export function wantsMarkdownResponse(acceptHeader) {
  if (!acceptHeader) {
    return false;
  }

  return acceptHeader.toLowerCase().includes("text/markdown");
}
