<script module lang="ts">
  declare const __APP_VERSION__: string;

  declare global {
    interface Document {
      startViewTransition(
        callbackOptions?: ViewTransitionUpdateCallback | StartViewTransitionOptions
      ): ViewTransition;
    }
  }

  export {};
</script>

<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import "$lib/drop-in.css";

  const { children } = $props();

  onNavigate((navigation) => {
	if (!document.startViewTransition) return;
	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
  });
</script>

<svelte:head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Graffiti - A minimal CSS toolkit</title>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&family=Lexend:wght@100..900&family=Manrope:wght@200..800&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Outfit:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Space+Grotesk:wght@300..700&family=Syne:wght@400..800&display=swap"
    rel="stylesheet"
  />
  <script
    defer
    data-domain="graffiti-ui.com"
    src="https://analytics.tolin.ski/js/script.js"
  ></script>
</svelte:head>

{@render children()}
