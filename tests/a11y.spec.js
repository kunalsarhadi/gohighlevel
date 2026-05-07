// @ts-check
const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

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
  test(`a11y: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    // Force all reveal animations to their final visible state so axe
    // tests actual content contrast, not mid-transition opacity values
    await page.addStyleTag({
      content: `
        .reveal, .reveal.visible {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
      `,
    });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    const critical = results.violations.filter(v => v.impact === 'critical');
    const serious  = results.violations.filter(v => v.impact === 'serious');
    const all      = [...critical, ...serious];

    if (all.length > 0) {
      const report = all.map(v =>
        `[${v.impact.toUpperCase()}] ${v.id}: ${v.description}\n` +
        v.nodes.slice(0, 3).map(n => `  → ${n.html}`).join('\n')
      ).join('\n\n');
      console.log(`\n── A11y violations on ${path} ──\n${report}\n`);
    }

    expect(critical, `Critical WCAG violations on ${path}`).toHaveLength(0);
    expect(serious,  `Serious WCAG violations on ${path}`).toHaveLength(0);
  });
}
