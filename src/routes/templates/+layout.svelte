<script lang="ts">
	import type { FontSettings, ThemeValues, BorderRadiusSettings } from "$lib/types";
	import ThemeControls from "$docs/ThemeControls.svelte";

	let { children } = $props();

	let theme_values: ThemeValues = $state({
		fg_light: "#111111",
		fg_dark: "#ffffff",
		bg_light: "#ffffff",
		bg_dark: "#111111",
		primary: "#0066ff",
	});

	let font_settings: FontSettings = $state({
		min_ratio: 6 / 5,
		max_ratio: 4 / 3,
		min_font_size: 16,
		max_font_size: 18,
		min_viewport: 320,
		max_viewport: 1500,
		font_family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif",
	});

	let border_radius: BorderRadiusSettings = $state({
		br_xs: "2px",
		br_s: "4px",
		br_m: "8px",
		br_l: "16px",
		br_xl: "24px",
		br_xxl: "32px",
	});

	$effect(() => {
		const style = document.documentElement.style;
		for (const key in theme_values) {
			const value = theme_values[key as keyof ThemeValues];
			style.setProperty(`--${key.replace("_", "-")}`, value);
		}
	});

	$effect(() => {
		document.documentElement.style.setProperty("--font-sans", font_settings.font_family);
	});

	$effect(() => {
		const style = document.documentElement.style;
		for (const key in border_radius) {
			const value = border_radius[key as keyof BorderRadiusSettings];
			style.setProperty(`--${key.replace(/_/g, "-")}`, value);
		}
	});
</script>

<ThemeControls bind:theme_values bind:font_settings bind:border_radius />

<div
	style:--fg-light={theme_values.fg_light}
	style:--bg-light={theme_values.bg_light}
	style:--fg-dark={theme_values.fg_dark}
	style:--bg-dark={theme_values.bg_dark}
	style:--primary={theme_values.primary}
	style:--font-size-min={font_settings.min_font_size}
	style:--font-size-max={font_settings.max_font_size}
	style:--font-ratio-min={font_settings.min_ratio}
	style:--font-ratio-max={font_settings.max_ratio}
	style:--font-width-min={font_settings.min_viewport}
	style:--font-width-max={font_settings.max_viewport}
>
	<header class="header border sticky">
		<a href="/" style="color: var(--fg); text-decoration: none;">← Back to Docs</a>
	</header>

	{@render children()}
</div>
