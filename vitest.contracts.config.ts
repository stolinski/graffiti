import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/contracts/**/*.test.ts"],
    environment: "node",
    globals: true,
  },
});
