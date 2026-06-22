import { defineConfig, devices } from "@playwright/test";

const MOCK = "http://127.0.0.1:4010";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: [
    {
      command: "node e2e/mock-server.mjs",
      port: 4010,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `NEXT_PUBLIC_API_BASE_URL=${MOCK} npm run build && NEXT_PUBLIC_API_BASE_URL=${MOCK} npx next start -p 3100`,
      port: 3100,
      timeout: 240_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
