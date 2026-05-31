import {
  agentSections,
  docsRouteGuides,
  siteUrl,
  templatePages,
} from "./manifest.js";
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

/**
 * @typedef {Object} TemplatePage
 * @property {string} slug
 * @property {string} routePath
 * @property {string} title
 * @property {string} summary
 * @property {string} bestFor
 * @property {string[]} highlights
 * @property {string[]} classes
 */

/** @typedef {ReturnType<import("$docs/content/topics.js").parseTopicMarkdown>} RuntimeTopic */

/** @type {AgentSection[]} */
const sections = agentSections;

/** @type {RouteGuide[]} */
const guides = docsRouteGuides;

/** @type {TemplatePage[]} */
const templates = templatePages;

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

/** @param {string} topicId */
function sectionTopicAnchor(topicId) {
  return `topic-${topicId}`;
}

/** @param {string} sectionRoutePath @param {string} topicId */
function sectionTopicPath(sectionRoutePath, topicId) {
  return `${normalizePath(sectionRoutePath)}/${topicId}`;
}

/** @param {{ title: string, url: string, description: string }} input */
function markdownFrontmatter({ title, url, description }) {
  return `---\ntitle: "${title}"\nurl: ${url}\ndescription: "${description}"\n---`;
}

/**
 * Render a single runtime topic to markdown with full content
 * @param {RuntimeTopic} topic
 * @param {AgentSection} section
 */
function renderTopicMarkdown(topic, section) {
  const classSection =
    topic.classes.length > 0
      ? `**Classes:** ${topic.classes.map((c) => `\`${c}\``).join(", ")}\n\n`
      : "";

  const topicPath = sectionTopicPath(section.routePath, topic.id);
  const topicAnchor = sectionTopicAnchor(topic.id);

  return `<a id="${topicAnchor}"></a>\n\n## ${topic.title}\n\n${topic.summary}\n\n**When to use:** ${topic.whenToUse}\n\n${classSection}**Direct topic doc:** [${toAbsolute(topicPath)}](${toAbsolute(topicPath)})\n\n${topic.markdown}\n`;
}

/**
 * Get runtime topics for a section, strictly matching manifest order.
 * @param {AgentSection} section
 */
function getOrderedRuntimeTopics(section) {
  const runtimeTopics = getTopicsForRoute(routeKeyFromPath(section.routePath));
  const runtimeById = new Map(runtimeTopics.map((t) => [t.id, t]));

  const manifestSlugs = section.usageOrder.map((topic) => topic.slug);
  const missingInRuntime = manifestSlugs.filter(
    (slug) => !runtimeById.has(slug),
  );
  const manifestSlugSet = new Set(manifestSlugs);
  const missingInManifest = runtimeTopics
    .map((topic) => topic.id)
    .filter((id) => !manifestSlugSet.has(id));

  if (missingInRuntime.length > 0 || missingInManifest.length > 0) {
    const missingRuntimeText =
      missingInRuntime.length > 0
        ? `Missing in runtime: ${missingInRuntime.join(", ")}`
        : "";
    const missingManifestText =
      missingInManifest.length > 0
        ? `Missing in manifest: ${missingInManifest.join(", ")}`
        : "";
    const details = [missingRuntimeText, missingManifestText]
      .filter(Boolean)
      .join(" | ");

    throw new Error(
      `Agent docs manifest mismatch for ${section.routePath}. ${details}`,
    );
  }

  const ordered = [];
  for (const slug of manifestSlugs) {
    const topic = runtimeById.get(slug);
    if (!topic) {
      throw new Error(
        `Agent docs manifest mismatch for ${section.routePath}. Topic "${slug}" was not found after validation.`,
      );
    }
    ordered.push(topic);
  }

  return ordered;
}

/**
 * Render a topic-level markdown page for selective fetches.
 * @param {AgentSection} section
 * @param {RuntimeTopic} topic
 */
export function renderAgentTopicMarkdown(section, topic) {
  const topicPath = sectionTopicPath(section.routePath, topic.id);
  const frontmatter = markdownFrontmatter({
    title: `Graffiti ${section.title}: ${topic.title}`,
    url: toAbsolute(topicPath),
    description: topic.summary,
  });

  const classes =
    topic.classes.length > 0
      ? topic.classes.map((item) => `\`${item}\``).join(", ")
      : "none";

  return `${frontmatter}

# ${topic.title}

${topic.summary}

- **Section:** [Graffiti ${section.title}](${toAbsolute(section.routePath)})
- **When to use:** ${topic.whenToUse}
- **Classes:** ${classes}

---

${topic.markdown}`;
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
  const topicContent = runtimeTopics
    .map((topic) => renderTopicMarkdown(topic, section))
    .join("\n---\n\n");

  // Quick reference index at the top
  const topicIndex = runtimeTopics
    .map((topic) => {
      const classes =
        topic.classes.length > 0
          ? ` (${topic.classes.slice(0, 3).join(", ")})`
          : "";
      const anchor = `#${sectionTopicAnchor(topic.id)}`;
      const topicPath = sectionTopicPath(section.routePath, topic.id);
      return `- [**${topic.title}**](${anchor})${classes} - ${topic.whenToUse} ([topic](${toAbsolute(topicPath)}))`;
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

export function renderTemplatesIndexMarkdown() {
  const frontmatter = markdownFrontmatter({
    title: "Graffiti Templates",
    url: toAbsolute("/templates"),
    description:
      "Production-style templates built with Graffiti classes and semantic HTML.",
  });

  const templateLinks = templates
    .map(
      (template) =>
        `- [${template.title}](${toAbsolute(template.routePath)}) - ${template.summary}`,
    )
    .join("\n");

  return `${frontmatter}

# Graffiti Templates

Production-style templates built with Graffiti classes and semantic HTML.

## Available Templates

${templateLinks}

## Usage Notes

- Copy structure first, then tune with custom properties (\`--gap\`, \`--layout-gap\`, \`--surface-bg\`)
- Keep semantic HTML and only add classes where the pattern requires it
- Prefer native elements (\`<dialog>\`, \`<details>\`, popover, table semantics) before custom JS
`;
}

/** @param {TemplatePage} template */
export function renderTemplateMarkdown(template) {
  const frontmatter = markdownFrontmatter({
    title: `Graffiti Template: ${template.title}`,
    url: toAbsolute(template.routePath),
    description: template.summary,
  });

  const highlights = template.highlights.map((item) => `- ${item}`).join("\n");
  const classes = template.classes.map((item) => `\`${item}\``).join(", ");

  return `${frontmatter}

# ${template.title}

${template.summary}

**Best for:** ${template.bestFor}

## Key Patterns

${highlights}

## Common Classes

${classes}

## References

- [Open rendered template](${toAbsolute(template.routePath)})
- [All templates](${toAbsolute("/templates")})
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

Request section routes, topic routes (for example \`/elements/buttons\`), or template routes with \`Accept: text/markdown\` to get agent-optimized docs.
`;
}

const sectionByPath = new Map(
  sections.map((section) => [normalizePath(section.routePath), section]),
);

const guideByPath = new Map(
  guides.map((guide) => [normalizePath(guide.routePath), guide]),
);

const templateByPath = new Map(
  templates.map((template) => [normalizePath(template.routePath), template]),
);

/** @param {string} normalizedPath */
function getSectionTopicForPath(normalizedPath) {
  const match = /^\/([a-z0-9-]+)\/([a-z0-9-]+)$/.exec(normalizedPath);
  if (!match) {
    return null;
  }

  const sectionPath = `/${match[1]}`;
  const topicId = match[2];
  const section = sectionByPath.get(sectionPath);
  if (!section) {
    return null;
  }

  const runtimeTopics = getTopicsForRoute(routeKeyFromPath(section.routePath));
  const topic = runtimeTopics.find((entry) => entry.id === topicId);
  if (!topic) {
    return null;
  }

  return { section, topic };
}

/** @param {string} pathname */
export function getAgentMarkdownForPath(pathname) {
  const normalizedPath = normalizePath(pathname);

  if (normalizedPath === "/") {
    return renderAgentIndexMarkdown();
  }

  if (normalizedPath === "/templates") {
    return renderTemplatesIndexMarkdown();
  }

  const template = templateByPath.get(normalizedPath);
  if (template) {
    return renderTemplateMarkdown(template);
  }

  const section = sectionByPath.get(normalizedPath);
  if (section) {
    return renderAgentSectionMarkdown(section);
  }

  const sectionTopic = getSectionTopicForPath(normalizedPath);
  if (sectionTopic) {
    return renderAgentTopicMarkdown(sectionTopic.section, sectionTopic.topic);
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
