import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";
import {
  getAgentMarkdownForPath,
  wantsMarkdownResponse,
} from "$docs/agent/markdown.js";

const MARKDOWN_HEADERS = {
  "content-type": "text/markdown; charset=utf-8",
  "cache-control": "public, max-age=300",
  vary: "accept",
};

export const handle: Handle = async ({ event, resolve }) => {
  // If the user hits the ugly Netlify URL...
  if (event.url.hostname.includes("netlify.app")) {
    // ...throw them to the real domain immediately.
    throw redirect(
      301,
      `https://www.graffiti-ui.com${event.url.pathname}${event.url.search}`,
    );
  }

  if (wantsMarkdownResponse(event.request.headers.get("accept"))) {
    const markdown = getAgentMarkdownForPath(event.url.pathname);
    if (markdown) {
      return new Response(markdown, {
        status: 200,
        headers: MARKDOWN_HEADERS,
      });
    }
  }

  return resolve(event);
};
