import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    include: ["tests/contracts/**/*.test.ts", "src/**/*.test.ts"],
    environment: "node",
    globals: true,
  },
});
