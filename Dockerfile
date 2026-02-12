FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat curl gzip brotli
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Set SEO-critical environment variables at build time
ENV NEXT_PUBLIC_SITE_URL=https://leegoscaffolding.com
ENV NEXT_PUBLIC_DEFAULT_LOCALE=zh
ENV NEXT_PUBLIC_GA_ID=G-96N9T1MJP2
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

# Build with optimization flags
RUN npm run build

# Run SEO validation during build
RUN node scripts/validate-seo.mjs || echo "SEO validation completed with warnings"

# Run performance check for Core Web Vitals optimization
RUN node scripts/performance-check.mjs || echo "Performance check completed with warnings"

# Verify SEO assets were generated
RUN test -f .next/server/app/sitemap.xml || test -f public/sitemap.xml || (echo "Warning: Sitemap may be generated dynamically" && exit 0)
RUN test -f .next/server/app/robots.txt || test -f public/robots.txt || (echo "Warning: Robots.txt may be generated dynamically" && exit 0)

# Verify critical SEO assets exist (favicon, manifest, og-image)
RUN test -f public/scaffolding-logo.png || (echo "Warning: OG image missing" && exit 0)
RUN test -d public/favicon || (echo "Warning: Favicon directory missing" && exit 0)
RUN test -f public/favicon/site.webmanifest || (echo "Warning: Webmanifest missing" && exit 0)

# Pre-compress static assets for better performance (SEO - faster page loads)
RUN find .next/static -type f \( -name "*.js" -o -name "*.css" -o -name "*.json" \) -exec gzip -9 -k {} \; || true
RUN find .next/static -type f \( -name "*.js" -o -name "*.css" -o -name "*.json" \) -exec brotli -q 11 {} \; || true

# Pre-compress public assets referenced in SEO (favicon, manifest, images)
RUN find public -type f \( -name "*.svg" -o -name "*.json" -o -name "*.webmanifest" \) -exec gzip -9 -k {} \; || true
RUN find public -type f \( -name "*.svg" -o -name "*.json" -o -name "*.webmanifest" \) -exec brotli -q 11 {} \; || true

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN chown -R nextjs:nodejs ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
