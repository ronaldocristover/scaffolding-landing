# Next.js 16 SEO Technical Audit & Optimization Context

## Instructions for AI
Please analyze the provided Next.js 16 codebase and provide a comprehensive SEO technical audit. Check all points below and provide specific recommendations with code examples.

---

## 1. METADATA & SEO FUNDAMENTALS

### Check Points:
- [ ] Are metadata exports properly configured in layout.tsx and page.tsx files?
- [ ] Is generateMetadata() used for dynamic pages?
- [ ] Are Open Graph tags complete (title, description, image, url, type)?
- [ ] Are Twitter Card tags properly set?
- [ ] Is canonical URL set correctly?
- [ ] Are viewport and charset meta tags present?
- [ ] Is lang attribute set in HTML tag?

### Review These Files:
```
app/layout.tsx
app/page.tsx
app/[dynamic]/page.tsx (if any)
```

### Expected Implementation:
```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: 'Site Title',
    template: '%s | Site Title'
  },
  description: 'Site description',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://yourdomain.com',
    siteName: 'Site Name',
  },
}

// app/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: 'Dynamic Title',
    description: 'Dynamic description',
  }
}
```

---

## 2. SITEMAP GENERATION

### Check Points:
- [ ] Is sitemap.ts/sitemap.xml properly configured?
- [ ] Does sitemap include all important pages?
- [ ] Are lastModified dates accurate?
- [ ] Are priority and changeFrequency set appropriately?
- [ ] Is sitemap handling dynamic routes?

### Review These Files:
```
app/sitemap.ts
```

### Expected Implementation:
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://yourdomain.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic pages (fetch from database/API)
  const posts = await fetchAllPosts()
  const dynamicPages = posts.map((post) => ({
    url: `https://yourdomain.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...dynamicPages]
}
```

---

## 3. ROBOTS.TXT CONFIGURATION

### Check Points:
- [ ] Is robots.ts properly configured?
- [ ] Are important directories allowed/disallowed correctly?
- [ ] Is sitemap URL referenced?
- [ ] Are multiple user agents handled if needed?

### Review These Files:
```
app/robots.ts
```

### Expected Implementation:
```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
    ],
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

---

## 4. IMAGE OPTIMIZATION

### Check Points:
- [ ] Are all images using next/image component?
- [ ] Are alt texts descriptive and SEO-friendly?
- [ ] Are width and height specified?
- [ ] Is priority set for above-the-fold images?
- [ ] Is lazy loading implemented for below-the-fold images?
- [ ] Are image formats optimized (webp, avif)?
- [ ] Are placeholder blur implemented?
- [ ] Are image sizes responsive?

### Review These Files:
```
All component files using images
next.config.js - images configuration
```

### Expected Implementation:
```typescript
import Image from 'next/image'

// Above the fold image
<Image
  src="/hero-image.jpg"
  alt="Descriptive alt text with keywords"
  width={1200}
  height={600}
  priority
  quality={90}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Below the fold image
<Image
  src="/content-image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={400}
  loading="lazy"
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

---

## 5. STRUCTURED DATA (SCHEMA.ORG)

### Check Points:
- [ ] Is JSON-LD structured data implemented?
- [ ] Are appropriate schema types used (Organization, WebSite, Article, Product, etc.)?
- [ ] Is BreadcrumbList schema implemented?
- [ ] Is LocalBusiness schema added (if applicable)?
- [ ] Are all required properties filled?

### Review These Files:
```
app/layout.tsx
app/page.tsx
Component files that need structured data
```

### Expected Implementation:
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Your Company Name',
    url: 'https://yourdomain.com',
    logo: 'https://yourdomain.com/logo.png',
    sameAs: [
      'https://facebook.com/yourpage',
      'https://twitter.com/yourhandle',
      'https://linkedin.com/company/yourcompany',
    ],
  }

  return (
    <html lang="id">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  )
}

// app/blog/[slug]/page.tsx
export default function BlogPost({ post }) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* content */}
    </>
  )
}
```

---

## 6. PERFORMANCE OPTIMIZATION

### Check Points:
- [ ] Is code splitting implemented properly?
- [ ] Are dynamic imports used for heavy components?
- [ ] Is font optimization configured?
- [ ] Are third-party scripts loaded with next/script?
- [ ] Is script strategy (afterInteractive, lazyOnload) set correctly?
- [ ] Are CSS/JS minified?
- [ ] Is compression enabled?
- [ ] Are unused dependencies removed?

### Review These Files:
```
All component files
app/layout.tsx
next.config.js
package.json
```

### Expected Implementation:
```typescript
// Dynamic imports
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // if not needed on server
})

// Font optimization
import { Inter, Roboto } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Script optimization
import Script from 'next/script'

<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  strategy="afterInteractive"
/>
```

---

## 7. CORE WEB VITALS

### Check Points:
- [ ] Is reportWebVitals implemented?
- [ ] Are metrics being sent to analytics?
- [ ] Is LCP (Largest Contentful Paint) optimized?
- [ ] Is FID (First Input Delay) minimized?
- [ ] Is CLS (Cumulative Layout Shift) prevented?
- [ ] Are images and fonts causing layout shifts?

### Review These Files:
```
app/layout.tsx or pages/_app.tsx
Components with heavy content
```

### Expected Implementation:
```typescript
// app/layout.tsx
export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    console.log(metric)
    
    // Send to analytics
    window.gtag?.('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    })
  }
}
```

---

## 8. URL STRUCTURE & ROUTING

### Check Points:
- [ ] Are URLs clean and descriptive?
- [ ] Are dynamic segments properly named?
- [ ] Are redirects configured for old URLs?
- [ ] Is trailing slash handling consistent?
- [ ] Are route groups used appropriately?
- [ ] Are parallel routes or intercepting routes causing SEO issues?

### Review These Files:
```
app/ directory structure
next.config.js (redirects, rewrites)
```

### Expected Implementation:
```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true, // 301 redirect
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
    ]
  },
  
  async rewrites() {
    return [
      {
        source: '/blog/:slug',
        destination: '/posts/:slug',
      },
    ]
  },
  
  trailingSlash: false, // or true, be consistent
}
```

---

## 9. NEXT.CONFIG.JS OPTIMIZATION

### Check Points:
- [ ] Is compression enabled?
- [ ] Are image domains configured?
- [ ] Are headers set for caching?
- [ ] Is reactStrictMode enabled?
- [ ] Are experimental features properly configured?
- [ ] Is output mode set correctly (standalone for Docker)?

### Review These Files:
```
next.config.js
next.config.mjs
```

### Expected Implementation:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  
  images: {
    domains: ['yourdomain.com', 'cdn.yourdomain.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Production optimizations
  swcMinify: true,
  poweredByHeader: false,
  
  // Bundle analysis (optional)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
```

---

## 10. INTERNAL LINKING STRUCTURE

### Check Points:
- [ ] Are important pages linked from homepage?
- [ ] Is Link component from next/link used?
- [ ] Are anchor texts descriptive?
- [ ] Is breadcrumb navigation implemented?
- [ ] Are related content sections added?
- [ ] Is pagination SEO-friendly?

### Review These Files:
```
All component files with navigation
app/layout.tsx (main navigation)
```

### Expected Implementation:
```typescript
import Link from 'next/link'

// Proper internal linking
<Link href="/about" prefetch={true}>
  About Us
</Link>

// Breadcrumb component
export function Breadcrumb({ items }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb">
        {items.map((item, index) => (
          <Link key={index} href={item.url}>
            {item.name}
          </Link>
        ))}
      </nav>
    </>
  )
}
```

---

## 11. MOBILE OPTIMIZATION

### Check Points:
- [ ] Is viewport meta tag set correctly?
- [ ] Are touch targets properly sized (min 48x48px)?
- [ ] Is text readable without zooming?
- [ ] Are tap delays removed?
- [ ] Is responsive design implemented?
- [ ] Are mobile-specific optimizations added?

### Review These Files:
```
app/layout.tsx
tailwind.config.js or CSS files
All component files
```

### Expected Implementation:
```typescript
// app/layout.tsx
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

// Responsive images
<Image
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={600}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

---

## 12. SECURITY & BEST PRACTICES

### Check Points:
- [ ] Are Content Security Policy headers set?
- [ ] Is HTTPS enforced?
- [ ] Are sensitive files excluded from robots?
- [ ] Is noindex set for non-public pages?
- [ ] Are API routes properly secured?
- [ ] Is environment variables handling secure?

### Review These Files:
```
next.config.js
.env.local
middleware.ts
```

### Expected Implementation:
```typescript
// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  return response
}

// app/admin/layout.tsx (noindex for admin pages)
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}
```

---

## 13. ANALYTICS & MONITORING

### Check Points:
- [ ] Is Google Analytics properly integrated?
- [ ] Is Google Search Console connected?
- [ ] Is Vercel Analytics (or similar) configured?
- [ ] Are conversion events tracked?
- [ ] Is error monitoring set up?

### Review These Files:
```
app/layout.tsx
lib/analytics.ts
```

### Expected Implementation:
```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
```

---

## 14. INTERNATIONALIZATION (i18n)

### Check Points:
- [ ] Is i18n properly configured (if needed)?
- [ ] Are hreflang tags implemented?
- [ ] Is locale routing set up correctly?
- [ ] Are all pages translated?
- [ ] Is content properly localized?

### Review These Files:
```
next.config.js
app/[locale]/ directory structure
middleware.ts
```

### Expected Implementation:
```typescript
// app/[locale]/layout.tsx
export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `https://yourdomain.com/${params.locale}`,
      languages: {
        'id-ID': 'https://yourdomain.com/id',
        'en-US': 'https://yourdomain.com/en',
      },
    },
  }
}
```

---

## 15. DOCKER DEPLOYMENT (If Applicable)

### Check Points:
- [ ] Is `output: 'standalone'` set in next.config.js?
- [ ] Is Dockerfile using multi-stage build?
- [ ] Are image optimization settings correct for Docker?
- [ ] Is health check endpoint implemented?
- [ ] Are environment variables properly configured?
- [ ] Is .dockerignore file present and comprehensive?
- [ ] Are security headers set (via Nginx or middleware)?
- [ ] Is HTTPS enforced in production?
- [ ] Are static files cached properly?
- [ ] Is compression enabled (gzip/brotli)?

### Review These Files:
```
next.config.js (output mode)
Dockerfile
docker-compose.yml
.dockerignore
nginx.conf (if using reverse proxy)
app/api/health/route.ts
.env.production
```

### Expected Implementation:
```javascript
// next.config.js
module.exports = {
  output: 'standalone', // CRITICAL for Docker
  compress: true,
  images: {
    unoptimized: false, // Keep false for optimization
    domains: ['yourdomain.com'],
    formats: ['image/avif', 'image/webp'],
  },
}

// app/api/health/route.ts
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString() 
  })
}
```

### Dockerfile Check:
```dockerfile
# Should have multi-stage build
FROM node:20-alpine AS deps
# ... dependencies stage

FROM node:20-alpine AS builder
# ... build stage

FROM node:20-alpine AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
# ... production stage with standalone output
CMD ["node", "server.js"]
```

### Critical Docker SEO Items:
1. **HTTPS Setup**: Ensure reverse proxy (Nginx) redirects HTTP → HTTPS
2. **Compression**: Enable gzip/brotli in Nginx
3. **Security Headers**: Set via Nginx or Next.js middleware
4. **Static File Caching**: Configure long cache times for _next/static
5. **Base URL**: Set NEXT_PUBLIC_SITE_URL environment variable
6. **Sitemap/Robots**: Verify accessible in Docker container

---

## AUDIT CHECKLIST SUMMARY

Please provide output in this format:

### ✅ PASSED
- List items that are properly implemented

### ⚠️ WARNINGS
- List items that need attention but not critical

### ❌ CRITICAL ISSUES
- List items that must be fixed immediately

### 🐳 DOCKER-SPECIFIC ISSUES (if applicable)
- Docker configuration problems
- Container optimization needed
- Deployment-related SEO issues

### 📝 RECOMMENDATIONS
- Prioritized list of improvements with code examples

### 📊 SEO SCORE
- Overall score out of 100
- Breakdown by category
- Docker deployment score (if applicable)

---

## HOW TO USE THIS PROMPT

1. Share your codebase or specific files
2. Paste this entire prompt
3. Ask: "Please audit my Next.js 16 application for SEO using the context above"
4. AI will analyze and provide detailed recommendations

## ADDITIONAL REQUESTS

After the audit, you can ask:
- "Show me the complete implementation for [specific point]"
- "Generate the missing sitemap.ts file"
- "Create a comprehensive next.config.js with all optimizations"
- "Build a reusable SEO component"
- "Explain why [specific implementation] is important for SEO"
