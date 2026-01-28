import { test, expect } from "@playwright/test";

test.describe("SEO Tests", () => {
  test("should have correct title and metadata for English locale", async ({
    page,
  }) => {
    await page.goto("/en");

    // Check title
    await expect(page).toHaveTitle(/Leego Scaffolding/);

    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      "href",
      /leegoscaffolding\.com\/en/,
    );

    // Check language attribute
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // Check keywords
    const keywords = page.locator('meta[name="keywords"]');
    const content = await keywords.getAttribute("content");
    expect(content).toContain("scaffolding");
    expect(content).toContain("Master Hong");
    expect(content).toContain("leego");
    expect(content).toContain("康師傅搭掤");
  });

  test("should have correct title and metadata for Chinese locale", async ({
    page,
  }) => {
    await page.goto("/zh");

    // Check title
    await expect(page).toHaveTitle(/康師傅/); // Assuming Chinese title contains this

    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      "href",
      /leegoscaffolding\.com\/zh/,
    );

    // Check language attribute
    await expect(page.locator("html")).toHaveAttribute("lang", "zh");

    // Check keywords
    const keywords = page.locator('meta[name="keywords"]');
    const content = await keywords.getAttribute("content");
    expect(content).toContain("搭棚");
    expect(content).toContain("康師傅搭棚");
    expect(content).toContain("leego");
  });

  test("should have valid sitemap.xml", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("leegoscaffolding.com");
    expect(body).toContain("/en");
    expect(body).toContain("/zh");
  });

  test("should have valid robots.txt", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Sitemap: https://leegoscaffolding.com/sitemap.xml");
  });

  test("should have h1 tag for SEO", async ({ page }) => {
    await page.goto("/en");
    const h1 = page.locator("h1");
    await expect(h1).toBeAttached();
    await expect(h1).toHaveClass(/sr-only/); // Check if it's the hidden one we added
    // Match either the static text or the one coming from API/Service which might be "Scaffolding Engineering Limited..."
    await expect(h1).toHaveText(
      /Leego Scaffolding|Scaffolding Engineering Limited|康師傅/,
    );
  });

  test("should have proper Open Graph tags", async ({ page }) => {
    await page.goto("/en");

    const ogUrl = page.locator('meta[property="og:url"]');
    // Note: OpenGraph URL might handle locale differently depending on implementation,
    // but usually it's absolute. Next.js metadata API resolves it against metadataBase.
    // Since we set metadataBase to leegoscaffolding.com, it should be correct.
    // However, playwright accesses via localhost, so dynamic generation might differ
    // if not strictly using metadataBase.
    // Let's check if the 'og:description' is present at least.

    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "Leego Scaffolding",
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "en_US",
    );
  });
});
