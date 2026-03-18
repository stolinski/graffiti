import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { agentSections, docsRouteGuides } from "../src/docs/agent/manifest.js";

const filePath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(filePath);
const root = path.resolve(scriptDir, "..");
const llmsDir = path.join(root, "static/llms");

const llmsFiles = new Set(
  (await readdir(llmsDir))
    .filter((file) => file.endsWith(".txt"))
    .map((file) => file.trim()),
);

const errors = [];

/** @type {Map<string, { file: string, ids: Set<string> }>} */
const routeCache = new Map();

function routeFileForPath(routePath) {
  if (routePath === "/") {
    return path.join(root, "src/routes/(docs)/+page.svelte");
  }

  const slug = routePath.replace(/^\//, "");
  return path.join(root, `src/routes/(docs)/${slug}/+page.svelte`);
}

async function getRouteInfo(routePath) {
  if (routeCache.has(routePath)) {
    return routeCache.get(routePath);
  }

  const file = routeFileForPath(routePath);
  try {
    await access(file);
  } catch {
    errors.push(
      `Missing docs route file for ${routePath}: ${path.relative(root, file)}`,
    );
    return null;
  }

  const source = await readFile(file, "utf8");
  const ids = new Set(
    [...source.matchAll(/id=["']([^"']+)["']/g)].map((match) => match[1]),
  );

  const info = { file, ids };
  routeCache.set(routePath, info);
  return info;
}

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

  const routeInfo = await getRouteInfo(section.routePath);

  const topicSlugs = new Set();
  for (const topic of section.usageOrder) {
    if (topicSlugs.has(topic.slug)) {
      errors.push(`Duplicate topic slug in ${section.slug}: ${topic.slug}`);
    }
    topicSlugs.add(topic.slug);

    if (topic.llmsFile) {
      if (!llmsFiles.has(topic.llmsFile)) {
        errors.push(
          `Missing llms topic file for ${section.slug}/${topic.slug}: static/llms/${topic.llmsFile}`,
        );
      }
      continue;
    }

    if (!topic.routeAnchor || !topic.routeAnchor.startsWith("#")) {
      errors.push(
        `Topic without llmsFile must use routeAnchor in ${section.slug}/${topic.slug}`,
      );
      continue;
    }

    if (!routeInfo) {
      continue;
    }

    const anchor = topic.routeAnchor.slice(1);
    if (!routeInfo.ids.has(anchor)) {
      errors.push(
        `Missing anchor ${topic.routeAnchor} in ${path.relative(root, routeInfo.file)} for ${section.slug}/${topic.slug}`,
      );
    }
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

  await getRouteInfo(guide.routePath);

  for (const link of guide.topLinks) {
    if (link.href.startsWith("/llms/") && link.href.endsWith(".txt")) {
      const file = link.href.replace("/llms/", "");
      if (!llmsFiles.has(file)) {
        errors.push(
          `Guide ${guide.slug} references missing llms topic file: static/llms/${file}`,
        );
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Agent docs manifest check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Agent docs manifest check passed (${agentSections.length} sections, ${docsRouteGuides.length} guides, ${llmsFiles.size} llms topic files).`,
);
