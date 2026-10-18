import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
export default defineConfig({
  testDir: './tests', timeout: 45000, expect: { timeout: 10000 },
  fullyParallel: true, forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]],
  use: { trace: 'retain-on-failure', screenshot: 'only-on-failure', video: 'retain-on-failure' },
  projects: [
    { name: 'ui-chromium', testMatch: '**/ui/**/*.spec.ts', use: { ...devices['Desktop Chrome'], baseURL: process.env.UI_BASE_URL || 'https://automationexercise.com' } },
    { name: 'api', testMatch: '**/api/**/*.spec.ts', use: { baseURL: process.env.API_BASE_URL || 'https://automationexercise.com' } }
  ]
});