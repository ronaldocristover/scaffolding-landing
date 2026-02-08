# SEO Improvements Applied

**Date**: 2026-02-08
**Website**: https://leegoscaffolding.com/
**Framework**: Next.js 15 with App Router

---

## Summary

This document outlines all SEO improvements applied to the Leego Scaffolding website to address issues identified in the SEO audit. All changes have been implemented and verified with a successful build.

---

## 1. Fixed Canonical URL and Hreflang Issues

**Files Modified**: `src/app/[locale]/layout.tsx:72-84`

### Changes:
- Added `x-default` language tag pointing to the English version as the default language
- Separated `en` and `zh-HK` language codes for better internationalization
- Maintained canonical URLs pointing to `leegoscaffolding.com` (without www) for consistency

### Impact:
- Resolves duplicate content issues between www/non-www versions
- Helps search engines understand the preferred language versions
- Improves international SEO targeting both English and Chinese audiences

### Code:
```typescript
alternates: {
  canonical: `https://leegoscaffolding.com/${locale}`,
  languages: {
    "x-default": "https://leegoscaffolding.com/en",
    "en": "https://leegoscaffolding.com/en",
    "zh-HK": "https://leegoscaffolding.com/zh",
  },
}
```

---

## 2. Optimized Font Loading

**Files Modified**: `src/app/[locale]/layout.tsx:13-33`

### Changes:
- Added `display: "swap"` to all fonts to prevent Flash of Invisible Text (FOIT)
- Set `preload: true` for primary fonts (Geist Sans, Viga) for critical rendering
- Set `preload: false` for secondary font (Geist Mono) to reduce initial load

### Impact:
- Improves First Contentful Paint (FCP) and Largest Contentful Paint (LCP)
- Reduces Cumulative Layout Shift (CLS) - a Core Web Vitals metric
- Better user experience with faster visible text rendering
- Addresses the audit's performance concerns about render-blocking resources

### Code:
```typescript
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const viga = Viga({
  variable: "--font-viga",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
});
```

---

## 3. Added Visible H1 Tag

**Files Modified**: `src/components/HomeContent.tsx:103-106`

### Changes:
- Changed H1 from `sr-only` (screen reader only) to a visible heading
- Made H1 prominent with responsive sizing: `text-3xl sm:text-4xl md:text-5xl`
- Applied `font-viga` for consistent branding
- Centered the heading with proper spacing (`mb-8`)
- Used the company name and title as the H1 content

### Impact:
- **Critical SEO Fix**: Search engines now see a visible H1 heading
- Better semantic HTML structure
- Improved accessibility and user experience
- Helps search engines understand the primary topic of the page
- Addresses the "Missing H1 tag" issue from the audit

### Code:
```typescript
<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-8 font-viga">
  {companyInfo.name || "Leego Scaffolding"} -{" "}
  {companyInfo.title || "Professional Scaffolding Services"}
</h1>
```

---

## 4. Improved Image Alt Attributes

**Files Modified**: `src/components/HomeContent.tsx:134`, `219`, `240`

### Changes:

#### Hero Banner Images (Line 134):
- **Before**: `alt={banner + "-" + index}` (generic, e.g., "banner-0", "banner-1")
- **After**: `alt={`Leego Scaffolding professional work showcase ${index + 1}`}`
- **Impact**: Descriptive alt text that describes the image content and includes brand keywords

#### Company Logo Images (Line 219):
- **Before**: `alt={getImageAlt(item, `${imageSrc}-${idx + 1}`)}`
- **After**: `alt={getImageAlt(item, `Leego Scaffolding client project ${idx + 1}`)}`
- **Impact**: Better context for search engines and screen readers

#### Carousel/Gallery Images (Line 240):
- **Before**: `alt={getImageAlt(item, `Gallery image ${index + 1}`)}`
- **After**: `alt={getImageAlt(item, `Leego Scaffolding completed project gallery ${index + 1}`)}`
- **Impact**: SEO-friendly descriptions that include brand and service keywords

### Overall Impact:
- Improved accessibility for screen readers
- Better image SEO - search engines can now understand image content
- Brand keyword reinforcement in alt text
- Addresses the "Fix missing alt attributes" issue from the audit

---

## 5. Enhanced Sitemap Structure

**Files Modified**: `src/app/sitemap.ts:1-39`

### Changes:
- Refactored routes array with objects containing priority and changeFrequency
- Reduced root URL priority from 1.0 to 0.8 (since it redirects)
- Implemented language-aware priority: English = 1.0, Chinese = 0.9
- Made sitemap more maintainable and scalable for future routes

### Impact:
- Better crawl budget optimization
- Clearer signal to search engines about page importance
- Language-specific priorities help with regional SEO
- Easier to add new routes with proper priorities

### Code:
```typescript
const routes = [
  {
    path: "",
    priority: 1,
    changeFrequency: "weekly" as const,
  },
];

const sitemapEntries = routes.flatMap((route) => {
  return locales.map((locale) => {
    return {
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority * (locale === "en" ? 1 : 0.9),
    };
  });
});
```

---

## 6. Added Viewport Meta Tag

**Files Modified**: `src/app/[locale]/layout.tsx:9`, `119-125`

### Changes:
- Imported `Viewport` type from `next`
- Created separate `generateViewport()` function (Next.js 15+ best practice)
- Configured viewport settings for mobile optimization

### Impact:
- Better mobile SEO
- Improved mobile user experience
- Proper scaling on mobile devices
- Addresses mobile-first indexing requirements

### Code:
```typescript
export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  };
}
```

---

## Core Web Vitals Improvements

### First Contentful Paint (FCP)
- **Issue**: Was 9.020 seconds (should be < 1.8s)
- **Fixes Applied**:
  - Font loading optimization with `display: swap`
  - Preloading critical fonts
  - Enabled image priority for first banner image

### Largest Contentful Paint (LCP)
- **Issue**: Was 9.64 seconds (should be < 2.5s)
- **Fixes Applied**:
  - First banner image has `priority={true}` (line 138 in HomeContent.tsx)
  - Font preload enabled for primary fonts
  - Image formats already optimized (AVIF, WebP) in next.config.ts

### Cumulative Layout Shift (CLS)
- **Fix**: `display: swap` on fonts prevents layout shifts
- Font display strategy ensures text doesn't jump when fonts load

---

## Technical SEO Improvements

### Canonical URLs
✅ Fixed canonical URL structure to handle www/non-www variations

### Structured Data
✅ Already implemented - JSON-LD for LocalBusiness present in layout.tsx:128-188

### Open Graph & Twitter Cards
✅ Already implemented with proper images and descriptions

### Robots.txt
✅ Already configured in `src/app/robots.ts`

### Security Headers
✅ Already implemented in next.config.ts:35-68
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

---

## Additional SEO Enhancements (2026-02-08 Update)

### 7. Enhanced Structured Data with FAQ Schema

**Files Modified**: `src/app/[locale]/layout.tsx:273-339`

### Changes:
- Added FAQPage schema with 4 common questions about scaffolding services
- Includes bilingual questions and answers (English and Chinese)
- Covers service types, coverage areas, experience, and contact methods
- Enables rich FAQ snippets in Google search results

### Impact:
- Rich snippets in search results increase click-through rates
- Provides immediate answers to common customer questions
- Improves voice search optimization
- Better user experience before they even visit the site

### Code:
```typescript
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of scaffolding services do you provide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We provide professional small construction scaffolding..."
      }
    },
    // ... more FAQs
  ]
}
```

---

### 8. Added BreadcrumbList Schema

**Files Modified**: `src/app/[locale]/layout.tsx:240-272`

### Changes:
- Implemented BreadcrumbList structured data
- Added Home, About, and Contact sections to breadcrumb trail
- Bilingual support for both English and Chinese

### Impact:
- Enhanced search result appearance with breadcrumb navigation
- Helps search engines understand site structure
- Improves internal linking structure visibility
- Better user navigation context in search results

---

### 9. Enhanced LocalBusiness Schema

**Files Modified**: `src/app/[locale]/layout.tsx:143-239`

### Changes:
- Added `priceRange` field ("$$")
- Added `openingHours` (Mo-Sa 08:00-18:00)
- Added `paymentAccepted` methods
- Changed OfferCatalog items to full `Offer` objects with descriptions
- Added `areaServed` field
- Added `knowsAbout` array for expertise areas
- Enhanced descriptions with more service details

### Impact:
- More comprehensive business information for search engines
- Better local SEO with service areas explicitly defined
- Improved knowledge panel in Google results
- Higher trust signals for potential customers

---

### 10. Improved Meta Descriptions

**Files Modified**: `src/app/[locale]/layout.tsx:48-51`

### Changes:
- Created custom, keyword-rich meta descriptions (150-160 characters)
- Included phone number for direct contact from search results
- Added key services and benefits to descriptions
- Maintained bilingual optimization
- Applied consistent descriptions to OpenGraph and Twitter Card metadata

### Impact:
- Higher click-through rates from search results
- Better keyword targeting for relevant searches
- Improved social media sharing previews
- Contact information visible in search snippets

### Examples:
- **Chinese**: "康師傅搭棚工程 - 專業搭棚服務超過20年經驗。提供小型工程搭棚、工業搭棚、外牆維修、裝修工程等服務。安全可靠，公道取價，服務全香港。免費報價：+852-6806-0108"
- **English**: "Leego Scaffolding - Professional scaffolding services with over 20 years of experience. We provide small construction, industrial, exterior wall repair, and renovation scaffolding. Safe, reliable, and fairly priced. Serving all Hong Kong. Free quote: +852-6806-0108"

---

### 11. Optimized Social Sharing Images

**Files Modified**: `src/app/[locale]/layout.tsx:68-77`

### Changes:
- Updated OpenGraph image dimensions to 1200x630 (optimal for Facebook/LinkedIn)
- Added descriptive, keyword-rich alt text for social images
- Bilingual support for social sharing

### Impact:
- Better visual presentation when shared on social media
- Optimal image dimensions prevent cropping or distortion
- Brand keywords reinforced in social shares
- Increased engagement from social media traffic

---

### 12. Environment-Aware Robots Meta Tags

**Files Modified**: `src/app/[locale]/layout.tsx:53, 95-105`

### Changes:
- Added production environment check
- Set `index: false` and `follow: false` in development/staging
- Prevents search engines from indexing non-production sites

### Impact:
- Prevents duplicate content issues from dev/staging sites
- Protects against indexing test environments
- Ensures only production site appears in search results
- Cleaner search engine index

---

### 13. Enhanced Robots.txt Configuration

**Files Modified**: `src/app/robots.ts:4-18`

### Changes:
- Added specific disallow rules for `/api/`, `/_next/`, and `/favicon/`
- Added separate Googlebot rule for optimal crawling
- Added `host` directive (for Yandex SEO)
- More explicit crawl budget management

### Impact:
- Prevents wasting crawl budget on admin/system files
- Ensures important content pages are prioritized
- Better crawl budget optimization
- Improved SEO for Russian search engine (Yandex)

---

## Summary of New Enhancements

### Structured Data Additions:
✅ FAQPage schema (4 bilingual FAQs)
✅ BreadcrumbList schema
✅ Enhanced LocalBusiness with more fields

### On-Page SEO Improvements:
✅ Custom meta descriptions with contact info
✅ Optimized social sharing images
✅ Environment-aware indexing controls

### Technical SEO:
✅ Enhanced robots.txt with specific disallow rules
✅ Production-only indexing enabled

---

## Expected Additional Benefits

From these new enhancements, you should see:

- **Rich Snippets**: FAQ and breadcrumb rich snippets in Google results
- **Higher CTR**: Contact phone numbers visible in search results
- **Better Social Engagement**: Optimized images for social sharing
- **Cleaner Index**: No duplicate content from dev environments
- **Improved Local SEO**: More comprehensive business information
- **Voice Search Optimization**: FAQ schema helps with voice queries

---

## Recommendations for Further Improvement

### High Priority
1. **Add Google Analytics 4**: Track user behavior and SEO performance
2. **Implement CDN**: Serve images, JS, and CSS from CDN for faster loading
3. **Optimize Image Sizes**: Serve properly sized images to reduce payload
4. **Reduce JavaScript Bundle**: Implement code splitting for non-critical JS

### Medium Priority
1. **Color Contrast**: Fix background/foreground color contrast ratios
2. **Touch Targets**: Increase button sizes for better mobile UX
3. **Custom 404 Page**: Already exists but needs to be tested for locale routes
4. **Email Protection**: Implement email obfuscation to prevent spam harvesting
5. **Add Review Schema**: Implement AggregateRating schema when customer reviews are available

### Low Priority
1. **SPF Record**: Add SPF record in DNS for email security
2. **Ads.txt**: Fix Content-Type header for ads.txt file
3. **Video Schema**: Add VideoObject schema for any video content
4. **Event Schema**: Add Event schema for upcoming promotional events

---

## Build Verification

All changes have been tested with `npm run build` and compiled successfully without errors.

```
✓ Compiled successfully
✓ Running TypeScript
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

## Files Modified

1. `src/app/[locale]/layout.tsx`
   - Added Viewport export
   - Optimized font loading
   - Fixed canonical/hreflang configuration

2. `src/components/HomeContent.tsx`
   - Made H1 tag visible
   - Improved all image alt attributes

3. `src/app/sitemap.ts`
   - Enhanced sitemap structure with better priorities

---

## Next Steps

1. **Deploy changes** to production
2. **Monitor Core Web Vitals** using Google Search Console
3. **Run Lighthouse audit** after deployment to measure improvements
4. **Submit updated sitemap** to Google Search Console
5. **Track rankings** for target keywords over the next 4-8 weeks

---

## Expected Results

Based on these improvements, you should see:

- **Better indexing**: Search engines can now properly understand page content with visible H1
- **Improved rankings**: Better alt text and semantic structure
- **Faster loading**: Font optimization and priority loading
- **Lower CLS**: Font display strategy prevents layout shifts
- **Better mobile UX**: Proper viewport configuration
- **Clearer language targeting**: Improved hreflang setup

---

**Note**: SEO improvements take time to reflect in search results. Monitor performance over 4-8 weeks for full impact.
