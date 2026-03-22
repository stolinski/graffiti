import { error } from "@sveltejs/kit";

import { getRouteIntro, getTopicsForRoute } from "$docs/content/runtime.js";

/** @type {Record<string, string>} */
const SECTION_TITLES = {
  base: "Base",
  utilities: "Utilities",
  elements: "Elements",
  "ui-blocks": "UI Blocks",
};

/** @param {{ params: { section?: string; topic?: string } }} input */
export function load({ params }) {
  const sectionKey = String(params.section ?? "");
  const sectionTitle = SECTION_TITLES[sectionKey];

  if (!sectionTitle || !getRouteIntro(sectionKey)) {
    throw error(404, "Documentation section not found");
  }

  const topic = getTopicsForRoute(sectionKey).find(
    (entry) => entry.id === params.topic,
  );

  if (!topic) {
    throw error(404, "Documentation topic not found");
  }

  return {
    sectionKey,
    sectionTitle,
    sectionPath: `/${sectionKey}`,
    topic,
  };
}
