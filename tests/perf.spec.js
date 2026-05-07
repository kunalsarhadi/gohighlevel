// @ts-check
const { test, expect } = require('@playwright/test');

const LCP_THRESHOLD = 2500; // ms  — Google "good" threshold
const CLS_THRESHOLD = 0.1;  // score — Google "good" threshold

const pages = ['/', '/inventory.html', '/guide.html'];

for (const path of pages) {
  test(`web vitals: ${path}`, async ({ page, browserName }) => {
    // CDP is Chromium-only
    if (browserName !== 'chromium') test.skip();

    // Inject PerformanceObserver listeners BEFORE navigation
    await page.addInitScript(() => {
      window.__LCP = 0;
      window.__CLS = 0;

      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          window.__LCP = entry.startTime;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__CLS += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto(path, { waitUntil: 'networkidle' });

    // Give browser time to fire final LCP/CLS entries
    await page.waitForTimeout(1000);

    const lcp = await page.evaluate(() => window.__LCP);
    const cls = await page.evaluate(() => window.__CLS);

    console.log(`\n── Web Vitals: ${path} ──`);
    console.log(`  LCP: ${Math.round(lcp)}ms (threshold: ${LCP_THRESHOLD}ms) ${lcp < LCP_THRESHOLD ? '✓' : '✗'}`);
    console.log(`  CLS: ${cls.toFixed(4)}     (threshold: ${CLS_THRESHOLD})   ${cls < CLS_THRESHOLD ? '✓' : '✗'}`);

    expect(lcp, `LCP on ${path} should be < ${LCP_THRESHOLD}ms`).toBeLessThan(LCP_THRESHOLD);
    expect(cls, `CLS on ${path} should be < ${CLS_THRESHOLD}`).toBeLessThan(CLS_THRESHOLD);
  });
}
