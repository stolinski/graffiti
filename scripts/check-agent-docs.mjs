import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  agentSections,
  docsRouteGuides,
  templatePages,
} from "../src/docs/agent/manifest.js";
import { parseTopicMarkdown } from "../src/docs/content/topics.js";

const filePath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(filePath);
const root = path.resolve(scriptDir, "..");
const topicsDir = path.join(root, "src/docs/content/topics");

const errors = [];

/** @type {Map<string, ReturnType<typeof parseTopicMarkdown>[]>} */
const topicsByRoute = new Map();

/** @param {string} routePath */
function normalizeRoutePath(routePath) {
  if (routePath === "/") return "/";
  return routePath.replace(/\/+$/, "");
}

/** @param {string} routePath */
function routeFileCandidates(routePath) {
  const normalized = normalizeRoutePath(routePath);
  if (normalized === "/") {
    return [
      path.join(root, "src/routes/(docs)/+page.svelte"),
      path.join(root, "src/routes/+page.svelte"),
    ];
  }

  const slug = normalized.replace(/^\//, "");
  return [
    path.join(root, `src/routes/(docs)/${slug}/+page.svelte`),
    path.join(root, `src/routes/${slug}/+page.svelte`),
  ];
}

/** @param {string} routePath */
async function resolveRouteFile(routePath) {
  for (const candidate of routeFileCandidates(routePath)) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // keep checking candidates
    }
  }

  return null;
}

async function loadRuntimeTopics() {
  const topicFiles = (await readdir(topicsDir))
    .filter((file) => file.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b));

  for (const file of topicFiles) {
    const fullPath = path.join(topicsDir, file);
    const relativePath = path.relative(root, fullPath);
    const source = await readFile(fullPath, "utf8");
    const topic = parseTopicMarkdown(source, relativePath);

    const routeTopics = topicsByRoute.get(topic.route) ?? [];
    routeTopics.push(topic);
    topicsByRoute.set(topic.route, routeTopics);
  }
}

/** @param {string} topicPath */
function isKnownTopicPath(topicPath) {
  const match = /^\/([a-z0-9-]+)\/([a-z0-9-]+)$/.exec(
    normalizeRoutePath(topicPath),
  );
  if (!match) return false;

  const routeKey = match[1];
  const topicId = match[2];
  const topics = topicsByRoute.get(routeKey) ?? [];
  return topics.some((topic) => topic.id === topicId);
}

await loadRuntimeTopics();

const sectionSlugs = new Set();
const sectionRoutes = new Set();

for (const section of agentSections) {
  if (sectionSlugs.has(section.slug)) {
    errors.push(`Duplicate section slug: ${section.slug}`);
  }
  sectionSlugs.add(section.slug);

  if (sectionRoutes.has(section.routePath)) {
    errors.push(`Duplicate section routePath: ${section.routePath}`);
  }
  sectionRoutes.add(section.routePath);

  const routeFile = await resolveRouteFile(section.routePath);
  if (!routeFile) {
    errors.push(`Missing section route file for ${section.routePath}`);
  }

  const routeKey = section.routePath.replace(/^\//, "");
  const runtimeTopics = topicsByRoute.get(routeKey) ?? [];
  const runtimeTopicIds = new Set(runtimeTopics.map((topic) => topic.id));

  if (runtimeTopics.length === 0) {
    errors.push(
      `No runtime topics found for section ${section.slug} (route ${section.routePath})`,
    );
  }

  const usageSlugs = [];
  const usageSlugSet = new Set();
  for (const topic of section.usageOrder) {
    if (usageSlugSet.has(topic.slug)) {
      errors.push(`Duplicate topic slug in ${section.slug}: ${topic.slug}`);
      continue;
    }
    usageSlugSet.add(topic.slug);
    usageSlugs.push(topic.slug);
  }

  const missingInRuntime = usageSlugs.filter(
    (slug) => !runtimeTopicIds.has(slug),
  );
  if (missingInRuntime.length > 0) {
    errors.push(
      `Section ${section.slug} references missing topic ids: ${missingInRuntime.join(", ")}`,
    );
  }

  const missingInManifest = runtimeTopics
    .map((topic) => topic.id)
    .filter((topicId) => !usageSlugSet.has(topicId));

  if (missingInManifest.length > 0) {
    errors.push(
      `Section ${section.slug} is missing manifest entries for runtime topics: ${missingInManifest.join(", ")}`,
    );
  }
}

const templateSlugs = new Set();
const templateRoutes = new Set();

for (const template of templatePages) {
  if (templateSlugs.has(template.slug)) {
    errors.push(`Duplicate template slug: ${template.slug}`);
  }
  templateSlugs.add(template.slug);

  if (templateRoutes.has(template.routePath)) {
    errors.push(`Duplicate template routePath: ${template.routePath}`);
  }
  templateRoutes.add(template.routePath);

  if (!template.routePath.startsWith("/templates/")) {
    errors.push(
      `Template routePath must start with /templates/: ${template.slug} -> ${template.routePath}`,
    );
  }

  const routeFile = await resolveRouteFile(template.routePath);
  if (!routeFile) {
    errors.push(`Missing template route file for ${template.routePath}`);
  }

  if (!Array.isArray(template.highlights) || template.highlights.length === 0) {
    errors.push(`Template ${template.slug} must define at least one highlight`);
  }

  if (!Array.isArray(template.classes) || template.classes.length === 0) {
    errors.push(`Template ${template.slug} must define at least one class`);
  }
}

const guideSlugs = new Set();
for (const guide of docsRouteGuides) {
  if (guideSlugs.has(guide.slug)) {
    errors.push(`Duplicate guide slug: ${guide.slug}`);
  }
  guideSlugs.add(guide.slug);

  if (sectionRoutes.has(guide.routePath)) {
    errors.push(
      `Route path used by both section and guide: ${guide.routePath}`,
    );
  }

  const routeFile = await resolveRouteFile(guide.routePath);
  if (!routeFile) {
    errors.push(`Missing guide route file for ${guide.routePath}`);
  }

  for (const link of guide.topLinks) {
    if (!link.href.startsWith("/")) {
      continue;
    }

    const hrefPath = normalizeRoutePath(link.href.split("#")[0] || "/");
    const localRoute = await resolveRouteFile(hrefPath);
    const knownTopicRoute = isKnownTopicPath(hrefPath);

    if (!localRoute && !knownTopicRoute) {
      errors.push(
        `Guide ${guide.slug} references unknown local path: ${link.href}`,
      );
    }
  }
}

const templatesGuide = docsRouteGuides.find(
  (guide) => guide.routePath === "/templates",
);
if (templatesGuide) {
  const linkedRoutes = new Set(
    templatesGuide.topLinks
      .map((item) => normalizeRoutePath(item.href.split("#")[0] || "/"))
      .filter((href) => href.startsWith("/templates/")),
  );

  const missingTemplateLinks = [...templateRoutes].filter(
    (routePath) => !linkedRoutes.has(routePath),
  );

  if (missingTemplateLinks.length > 0) {
    errors.push(
      `Templates guide is missing topLinks for: ${missingTemplateLinks.join(", ")}`,
    );
  }
}

if (errors.length > 0) {
  console.error("Agent docs manifest check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

const totalTopics = [...topicsByRoute.values()].reduce(
  (sum, topics) => sum + topics.length,
  0,
);

console.log(
  `Agent docs manifest check passed (${agentSections.length} sections, ${docsRouteGuides.length} guides, ${templatePages.length} templates, ${totalTopics} runtime topics).`,
);
