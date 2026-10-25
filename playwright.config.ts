import { defineConfig, devices } from '@playwright/test';

/**
 * Uses the Playwright 1.64.1 + Chromium already installed for D:\EESA_WEB (resolved from the parent
 * node_modules; see README). Tests run against the production build on port 3200.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:3200',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npx next start -p 3200',
    url: 'http://localhost:3200',
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
