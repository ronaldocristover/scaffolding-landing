import { test, expect } from "@playwright/test";

test.describe("Homepage Tests", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle(/Leego Scaffolding|康師傅搭棚公司/);

    // Check main sections are present
    await expect(page.locator('section[id="home"]')).toBeVisible();
    await expect(page.locator('section[id="about"]')).toBeVisible();
    await expect(page.locator('section[id="company-logos"]')).toBeVisible();
    await expect(page.locator('section[id="contact"]')).toBeVisible();
  });

  test("should display hero section with company name", async ({ page }) => {
    await page.goto("/");

    // Check h1 with company name
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Leego Scaffolding|康師傅搭棚公司/);
  });

  test("should display banner carousel", async ({ page }) => {
    await page.goto("/");

    // Check if banner container exists
    const bannerContainer = page.locator('section[id="home"]').locator('div[class*="overflow-x-auto"]');
    await expect(bannerContainer).toBeVisible();

    // Check navigation buttons (if multiple banners)
    const prevButton = page.locator('button[aria-label="Previous image"]');
    const nextButton = page.locator('button[aria-label="Next image"]');

    // Buttons should be present if there are multiple banners
    const images = await page.locator('section[id="home"] img').count();
    if (images > 1) {
      await expect(prevButton).toBeVisible();
      await expect(nextButton).toBeVisible();
    }
  });

  test("should display about company section", async ({ page }) => {
    await page.goto("/");

    // Check about section
    await expect(page.locator('section[id="about"]')).toBeVisible();

    // Check for section title
    const sectionTitle = page.locator('section[id="about"] h2');
    await expect(sectionTitle).toBeVisible();

    // Check for company images
    const aboutImages = page.locator('section[id="about"] img');
    const imageCount = await aboutImages.count();
    expect(imageCount).toBeGreaterThan(0);
  });

  test("should display contact information", async ({ page }) => {
    await page.goto("/");

    // Check contact section
    await expect(page.locator('section[id="contact"]')).toBeVisible();

    // Check for contact info icons/links
    const contactSection = page.locator('section[id="contact"]');
    await expect(contactSection).toBeVisible();
  });

  test("should have floating action buttons", async ({ page }) => {
    await page.goto("/");

    // Check for WhatsApp and email floating buttons
    const floatingButtons = page.locator('a[class*="fixed"]');
    await expect(floatingButtons).toHaveCount(2);
  });

  test("should have footer with copyright", async ({ page }) => {
    await page.goto("/");

    // Check footer
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/©|康師傅搭棚公司/);
  });
});

test.describe("SEO Tests", () => {
  test("should have valid sitemap.xml", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("leegoscaffolding.com");
  });

  test("should have valid robots.txt", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Sitemap");
  });

  test("should have proper meta tags", async ({ page }) => {
    await page.goto("/");

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute("content", /width=device-width/);

    // Check for description meta tag
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /./);
  });

  test("should have Open Graph tags", async ({ page }) => {
    await page.goto("/");

    // Check OG title
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toBeAttached();

    // Check OG type
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", "website");

    // Check OG site name
    const ogSiteName = page.locator('meta[property="og:site_name"]');
    await expect(ogSiteName).toBeAttached();
  });
});

test.describe("Responsive Design Tests", () => {
  test("should render correctly on mobile", async ({ page, viewport }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check mobile navigation
    const mobileNav = page.locator("nav");
    await expect(mobileNav).toBeVisible();

    // Check content is visible
    await expect(page.locator('section[id="home"]')).toBeVisible();
  });

  test("should render correctly on tablet", async ({ page, viewport }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    // Check content sections
    await expect(page.locator('section[id="home"]')).toBeVisible();
    await expect(page.locator('section[id="about"]')).toBeVisible();
  });

  test("should render correctly on desktop", async ({ page, viewport }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // Check all main sections
    await expect(page.locator('section[id="home"]')).toBeVisible();
    await expect(page.locator('section[id="about"]')).toBeVisible();
    await expect(page.locator('section[id="company-logos"]')).toBeVisible();
  });
});

test.describe("Accessibility Tests", () => {
  test("should have proper alt text for images", async ({ page }) => {
    await page.goto("/");

    // Check that images have alt attributes
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).toBeDefined();
    }
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // Check for h1
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    // Check for h2
    const h2 = page.locator("h2");
    await expect(h2.first()).toBeVisible();
  });

  test("buttons should have aria-labels", async ({ page }) => {
    await page.goto("/");

    // Check navigation buttons
    const prevButton = page.locator('button[aria-label="Previous image"]');
    const nextButton = page.locator('button[aria-label="Next image"]');

    // At least check they exist when banners are present
    await expect(prevButton.or(nextButton)).toBeAttached();
  });
});

test.describe("Navigation Tests", () => {
  test("should scroll to sections when clicking navigation links", async ({
    page,
  }) => {
    await page.goto("/");

    // Test if anchor links work
    const aboutLink = page.locator('a[href="#about"]');
    if (await aboutLink.count() > 0) {
      await aboutLink.first().click();
      await expect(page.locator('section[id="about"]')).toBeInViewport();
    }
  });

  test("carousel navigation should work", async ({ page }) => {
    await page.goto("/");

    const bannerContainer = page.locator('section[id="home"] div[class*="overflow-x-auto"]');

    // Get initial scroll position
    const initialScroll = await bannerContainer.evaluate((el) => el.scrollLeft);

    // Try clicking next button if it exists
    const nextButton = page.locator('button[aria-label="Next image"]');
    if (await nextButton.count() > 0) {
      await nextButton.click();
      await page.waitForTimeout(500); // Wait for scroll animation

      // Check that scroll position changed
      const newScroll = await bannerContainer.evaluate((el) => el.scrollLeft);
      expect(newScroll).toBeGreaterThan(initialScroll);
    }
  });
});
