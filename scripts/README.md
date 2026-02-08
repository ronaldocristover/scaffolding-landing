# SEO Scripts

This directory contains automated SEO auditing and optimization scripts for the Leego Scaffolding website.

## Available Scripts

### SEO Audit (`seo-audit.mjs`)

Automated SEO audit tool that runs comprehensive checks on your website.

**Features:**
- Lighthouse performance, accessibility, and SEO audits
- Page structure analysis (meta tags, structured data, etc.)
- robots.txt and sitemap.xml validation
- Automated recommendations with priority levels
- JSON and terminal report generation

**Usage:**

```bash
# Run audit on production site
npm run audit:seo

# Run audit on custom URL
node scripts/seo-audit.mjs https://example.com

# Run audit on local development
node scripts/seo-audit.mjs http://localhost:3001
```

**Output:**
Reports are saved to `seo-audit-results/` directory with timestamps:
- `lighthouse-[timestamp].json` - Full Lighthouse report
- `seo-audit-[timestamp].json` - Combined SEO analysis

**What it checks:**
- ✅ Core Web Vitals (LCP, FID, CLS)
- ✅ Performance scores
- ✅ Accessibility (WCAG compliance)
- ✅ SEO best practices
- ✅ Meta tags completeness
- ✅ Structured data validation
- ✅ Mobile-friendliness
- ✅ Image optimization
- ✅ JavaScript bundle sizes

**Recommendation Levels:**
- **CRITICAL** - Fix immediately (major performance/SEO impact)
- **HIGH** - Fix this week (significant impact)
- **MEDIUM** - Fix this month (moderate impact)
- **LOW** - Nice to have (minor improvements)

## SEO Improvements Applied

### Critical Fixes (Completed)

1. **Root Redirect Optimization** (`src/middleware.ts`)
   - Changed default locale from 'zh' to 'en'
   - Improved middleware matcher pattern
   - **Impact**: Saves ~870ms on initial page load

2. **Schema Hours Correction** (`src/app/[locale]/layout.tsx`)
   - Fixed openingHours from "Mo-Sa 08:00-18:00" to "Mo-Sa 09:00-19:00"
   - Now matches footer information
   - **Impact**: NAP consistency, better trust

3. **WCAG Color Contrast** (`src/app/globals.css`)
   - Added darker variants for yellow/green backgrounds
   - Improved text contrast for better readability
   - **Impact**: Accessibility score improvement, WCAG AA compliance

4. **Touch Target Sizes** (`src/app/globals.css`)
   - Enforced 44x44px minimum for all interactive elements
   - Added proper padding for buttons and links
   - **Impact**: Mobile usability, accessibility score

5. **Image Optimization** (`next.config.ts`)
   - Configured optimal device and image sizes
   - Added 1-year cache TTL for optimized images
   - Added cache headers for `_next/image` routes
   - **Impact**: Saves ~77KB, faster image loading

6. **Accessibility Enhancements** (`src/app/globals.css`)
   - Added skip-to-main-content link styles
   - Improved focus-visible indicators
   - Enhanced keyboard navigation support
   - **Impact**: Better UX for keyboard/screen reader users

## Expected Results

After implementing all critical fixes, you should see:

- **Performance Score**: 95 → 98+
- **Accessibility Score**: 91 → 98+
- **SEO Score**: 100 (maintained)
- **Load Time**: ~1.1s faster
- **Core Web Vitals**: All metrics in "Good" range

## CI/CD Integration

To integrate SEO audits into your CI/CD pipeline, add to `.github/workflows/docker-build.yml`:

```yaml
- name: Run SEO Audit
  run: |
    npm run audit:seo
    # Fail build if score is below 80
    SCORE=$(node -e "console.log(Math.round((require('./seo-audit-results/seo-audit-latest.json').summary.averageScore || 0)))")
    if [ $SCORE -lt 80 ]; then
      echo "SEO score $SCORE is below threshold 80"
      exit 1
    fi
```

## Additional Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Web.dev - Core Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Schema.org Documentation](https://schema.org/LocalBusiness)
- [Next.js Image Optimization](https://nextjs.org/docs/api-reference/next/image)

## Troubleshooting

**Lighthouse fails to run:**
```bash
# Install Lighthouse CLI globally
npm install -g lighthouse
```

**Port already in use:**
```bash
# Change port in package.json
"dev": "next dev --turbopack --port 3002"
```

**Audit times out:**
- Increase timeout in the script (line with `maxBuffer`)
- Check if site is accessible
- Verify network connectivity

## Maintenance

Run SEO audit weekly or after major changes:
```bash
npm run audit:seo
```

Track progress by comparing scores over time:
```bash
# View latest audit
cat seo-audit-results/seo-audit-*.json | grep "averageScore"
```
