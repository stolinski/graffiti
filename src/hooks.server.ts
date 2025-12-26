import { redirect } from "@sveltejs/kit";

export async function handle({ event, resolve }) {
  // If the user hits the ugly Netlify URL...
  if (event.url.hostname.includes("netlify.app")) {
    // ...throw them to the real domain immediately.
    throw redirect(
      301,
      `https://www.graffiti-ui.com${event.url.pathname}${event.url.search}`,
    );
  }

  return resolve(event);
}
