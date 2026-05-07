// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const PORT = process.env.PORT ? Number(process.env.PORT) : 4173;
const baseURL = `http://127.0.0.1:${PORT}`;

const CHROMIUM_EXECUTABLE = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    // --- Chromium (local + CI) ---
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { executablePath: CHROMIUM_EXECUTABLE },
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        launchOptions: { executablePath: CHROMIUM_EXECUTABLE },
      },
    },

    // --- Firefox (CI only — requires `npx playwright install firefox`) ---
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: process.env.CI ? [] : ['**/*'],
    },

    // --- WebKit / Safari (CI only — requires `npx playwright install webkit`) ---
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: process.env.CI ? [] : ['**/*'],
    },
  ],
  webServer: {
    command: `npx --yes http-server . -p ${PORT} -s -c-1`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
