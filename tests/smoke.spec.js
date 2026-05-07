// @ts-check
const { test, expect } = require('@playwright/test');

const pages = [
  { path: '/', titleIncludes: 'Multi Family Deals' },
  { path: '/about.html', titleIncludes: 'About' },
  { path: '/why-alberta.html', titleIncludes: 'Alberta' },
  { path: '/inventory.html', titleIncludes: 'Inventory' },
  { path: '/inglewood.html', titleIncludes: 'Inglewood' },
  { path: '/buying-process.html', titleIncludes: 'Buying' },
  { path: '/guide.html', titleIncludes: 'Guide' },
  { path: '/faq.html', titleIncludes: 'FAQ' },
  { path: '/reviews.html', titleIncludes: 'Reviews' },
  { path: '/contact.html', titleIncludes: 'Contact' },
];

for (const { path, titleIncludes } of pages) {
  test(`page loads: ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status(), `HTTP status for ${path}`).toBeLessThan(400);
    await expect(page).toHaveTitle(new RegExp(titleIncludes, 'i'));
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
  });
}

test('homepage has primary CTA to contact', async ({ page }) => {
  await page.goto('/');
  const contactLinks = page.locator('a[href*="contact.html"]');
  await expect(contactLinks.first()).toBeVisible();
});
