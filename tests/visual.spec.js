// @ts-check
const { test, expect } = require('@playwright/test');

// All pages from sitemap.xml
const pages = [
  '/',
  '/about.html',
  '/why-alberta.html',
  '/inventory.html',
  '/inglewood.html',
  '/buying-process.html',
  '/faq.html',
  '/reviews.html',
  '/guide.html',
  '/contact.html',
];

for (const path of pages) {
  test(`visual: ${path}`, async ({ page }) => {
    // Freeze Date so "Last Updated" and any JS timers are deterministic
    await page.addInitScript(() => {
      const FROZEN = new Date('2026-01-01T00:00:00Z').getTime();
      const OrigDate = Date;
      // @ts-ignore
      globalThis.Date = class extends OrigDate {
        constructor(...args) { args.length ? super(...args) : super(FROZEN); }
        static now() { return FROZEN; }
      };
    });

    await page.goto(path, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    // Extra settle time for any RAF-based counters
    await page.waitForTimeout(600);

    const name = (path.replace(/\//g, '_').replace('.html', '') || '_home') + '.png';
    await expect(page).toHaveScreenshot(name, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      timeout: 15000,
    });
  });
}
