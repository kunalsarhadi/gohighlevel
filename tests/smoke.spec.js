// @ts-check
const { test, expect } = require('@playwright/test');

const pages = [
  { path: '/', titleIncludes: 'Multi Family Deals' },
  { path: '/about.html', titleIncludes: 'Multi.Family' },
  { path: '/why-alberta.html', titleIncludes: 'Alberta' },
  { path: '/inventory.html', titleIncludes: 'Multi.Family' },
  { path: '/inglewood.html', titleIncludes: 'Inglewood' },
  { path: '/buying-process.html', titleIncludes: 'Multi.Family' },
  { path: '/guide.html', titleIncludes: 'Guide' },
  { path: '/faq.html', titleIncludes: 'FAQ' },
  { path: '/reviews.html', titleIncludes: 'Reviews' },
  { path: '/contact.html', titleIncludes: 'Multi.Family' },
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

test('homepage has primary CTA to contact', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    // On mobile the desktop nav-cta is hidden; open the mobile nav and check there
    await page.locator('.hamburger').click();
    await expect(page.locator('.mobile-nav a[href*="contact.html"]')).toBeVisible();
  } else {
    await expect(page.locator('a.nav-cta[href*="contact.html"]')).toBeVisible();
  }
});
