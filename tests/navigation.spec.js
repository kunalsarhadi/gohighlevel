// @ts-check
const { test, expect } = require('@playwright/test');

test('internal nav links from homepage resolve', async ({ page, request }) => {
  await page.goto('/');
  const hrefs = await page.$$eval('a[href$=".html"]', (links) =>
    Array.from(new Set(links.map((a) => a.getAttribute('href')))).filter(Boolean)
  );
  expect(hrefs.length).toBeGreaterThan(0);

  for (const href of hrefs) {
    const url = href.startsWith('http') ? href : new URL(href, page.url()).toString();
    const res = await request.get(url);
    expect(res.status(), `expected 2xx for ${href}`).toBeLessThan(400);
  }
});

test('mobile menu toggle is reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('[aria-label="Open menu"]').first();
  await expect(toggle).toBeVisible();
});
