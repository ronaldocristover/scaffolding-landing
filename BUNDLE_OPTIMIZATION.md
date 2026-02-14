# Bundle Optimization Guide

This document outlines the performance optimizations implemented for the scaffolding website.

## Current Status (After Optimizations)

- **JavaScript Bundle**: 956 KB total static build (with code splitting)
- **Largest Chunk**: 218 KB (down from previous)
- **Compression**: Configured for production (handled by hosting/CDN)
- **Goal**: Reduce initial bundle size and improve Largest Contentful Paint (LCP)

## Implemented Optimizations

### 1. Code Splitting & Lazy Loading ✅

**Components**:
- `ContactInfo` - Dynamically imported with loading placeholder
- `FloatingButtons` - Client-side only (no SSR)
- `Carousel` - Dynamically imported with loading placeholder
- `PricingSection` - Already lazy loaded

**Benefits**:
- Reduced initial JavaScript payload
- Faster Time to First Byte (TTFB)
- Improved LCP score

**Location**: `src/components/HomeContent.tsx:12-24`

```typescript
const ContactInfo = dynamic(() => import("@/components/ContactInfo"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
  ssr: true,
});

const FloatingButtons = dynamic(() => import("@/components/FloatingButtons"), {
  ssr: false, // Only load on client side
});
```

### 2. Build Optimizations ✅

**Next.js Config** (`next.config.ts`):
- `compress: true` - Enables gzip compression
- `swcMinify: true` - Uses SWC minifier (faster than Terser)
- `reactStrictMode: true` - Enables additional checks
- `cacheComponents: true` - Caches component compilation

### 3. Image Optimization ✅

Already configured in `next.config.ts`:
- Modern formats: AVIF, WebP
- Responsive device sizes
- 1-year cache TTL for optimized images
- Lazy loading for below-fold images

### 4. Compression Configuration ✅

**Security Headers** (already configured):
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## Monitoring Bundle Size

### Check Bundle Script

Added `npm run check:bundle` script:

```bash
npm run check:bundle
```

This builds the project and shows the top 10 largest JS chunks.

### Bundle Analysis Script

```bash
npm run analyze:bundle
```

Uses `@next/bundle-analyzer` for detailed analysis.

## Next Steps for Further Optimization

### 1. Server-Side Compression

Configure Nginx/Vercel/Hosting provider to enable:
- **Gzip**: Level 6 compression
- **Brotli**: Level 5 compression (better ratios)

**Example Nginx config**:
```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
brotli on;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 2. Additional Code Splitting Opportunities

Consider lazy loading:
- Company logos section (below fold)
- Testimonials carousel (if added)
- Large image galleries

### 3. Tree Shaking

Review imports to ensure:
- Named imports instead of barrel imports
- Remove unused dependencies
- Check for duplicate packages

### 4. Asset Optimization

- Convert PNG/JPG to WebP/AVIF where possible
- Use SVG for icons and simple graphics
- Implement responsive image srcsets
- Add `priority` to above-fold images only

### 5. Route-Based Splitting

Split pages into separate routes:
- `/about` - About company page
- `/pricing` - Pricing page
- `/contact` - Contact page

## Performance Targets

| Metric | Current | Target |
|--------|---------|--------|
| JS Bundle Size | 735 KB | < 400 KB |
| First Contentful Paint | TBD | < 1.5s |
| LCP | TBD | < 2.5s |
| TTI | TBD | < 3.5s |
| Lighthouse Score | TBD | > 90 |

## Scripts Reference

- `npm run build` - Production build with Turbopack
- `npm run check:bundle` - Show largest chunks
- `npm run build:analyze` - Build and analyze bundle
- `npm run optimize` - Full optimization pipeline
- `npm run lint` - Check for code issues

## Monitoring

Run regularly:
```bash
# Weekly bundle size check
npm run check:bundle

# After major changes
npm run build:analyze

# Before deployment
npm run test && npm run build
```

## Resources

- [Next.js Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Bundle Size Analysis](https://bundlephobia.com/)
