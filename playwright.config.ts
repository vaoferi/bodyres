import { defineConfig, devices } from '@playwright/test';

const externalBaseURL = process.env.BODYRES_TEST_URL;
const baseURL = externalBaseURL ?? 'http://127.0.0.1:3001';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'node scripts/e2e-static-server.mjs',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
      },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
