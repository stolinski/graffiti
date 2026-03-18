import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:6124";

export default defineConfig({
  testDir: "tests/visual",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  snapshotPathTemplate:
    "{testDir}/__screenshots__/{testFilePath}/{projectName}/{arg}{ext}",
  use: {
    baseURL,
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    colorScheme: "light",
    timezoneId: "UTC",
    locale: "en-US",
  },
  webServer: {
    command:
      "npm run build && npx vite preview --host 127.0.0.1 --port 6124 --strictPort",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1200 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],
});
