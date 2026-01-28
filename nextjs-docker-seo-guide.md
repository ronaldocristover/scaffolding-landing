# Next.js 16 + Docker: SEO Optimization Guide

## CRITICAL DOCKER CONFIGURATIONS FOR SEO

---

## 1. NEXT.CONFIG.JS - OUTPUT MODE

### ⚠️ CRITICAL FOR DOCKER
Untuk Docker deployment, WAJIB set `output: 'standalone'`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Enable standalone output for Docker
  output: 'standalone',
  
  reactStrictMode: true,
  compress: true,
  
  images: {
    // IMPORTANT: Configure image optimization for production
    unoptimized: false, // Keep false to use Next.js image optimization
    domains: ['yourdomain.com', 'cdn.yourdomain.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Performance optimizations
  swcMinify: true,
  poweredByHeader: false,
  
  // Caching headers
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2)',
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
}

module.exports = nextConfig
```

---

## 2. DOCKERFILE OPTIMIZATION

### Multi-stage Dockerfile untuk Production

```dockerfile
# ============================================
# STAGE 1: Dependencies
# ============================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# ============================================
# STAGE 2: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application
RUN npm run build

# ============================================
# STAGE 3: Runner (Production)
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set to production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
```

---

## 3. .DOCKERIGNORE FILE

Optimasi build time dan ukuran image:

```dockerignore
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/

# Testing
coverage
.nyc_output

# Misc
.DS_Store
*.pem

# Debug
*.log

# Local env files
.env*.local
.env.development
.env.test

# Vercel
.vercel

# Git
.git
.gitignore

# IDE
.vscode
.idea
*.swp
*.swo

# Documentation
README.md
CHANGELOG.md
LICENSE

# CI/CD
.github
.gitlab-ci.yml

# Docker
Dockerfile*
docker-compose*.yml
```

---

## 4. DOCKER-COMPOSE.YML (Development & Production)

### Development
```yaml
version: '3.8'

services:
  nextjs-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
    env_file:
      - .env.local
```

### Production
```yaml
version: '3.8'

services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    env_file:
      - .env.production
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3
    networks:
      - app-network

  # Optional: Nginx as reverse proxy
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - nextjs
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

---

## 5. NGINX CONFIGURATION (Reverse Proxy)

### nginx.conf untuk SEO & Performance

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # Brotli compression (if module available)
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    upstream nextjs_upstream {
        server nextjs:3000;
        keepalive 64;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security Headers (CRITICAL FOR SEO)
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
        
        # HSTS (HTTP Strict Transport Security)
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

        # Static files caching
        location /_next/static/ {
            proxy_pass http://nextjs_upstream;
            proxy_cache_bypass $http_upgrade;
            
            # Cache for 1 year
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location /static/ {
            proxy_pass http://nextjs_upstream;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Image optimization
        location ~* \.(jpg|jpeg|png|gif|ico|webp|avif|svg)$ {
            proxy_pass http://nextjs_upstream;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Font files
        location ~* \.(woff|woff2|ttf|otf|eot)$ {
            proxy_pass http://nextjs_upstream;
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Access-Control-Allow-Origin "*";
        }

        # API routes (no caching)
        location /api/ {
            proxy_pass http://nextjs_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Main application
        location / {
            proxy_pass http://nextjs_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeout settings
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # robots.txt
        location = /robots.txt {
            proxy_pass http://nextjs_upstream;
            expires 1d;
            add_header Cache-Control "public, must-revalidate";
        }

        # sitemap.xml
        location = /sitemap.xml {
            proxy_pass http://nextjs_upstream;
            expires 1h;
            add_header Cache-Control "public, must-revalidate";
        }
    }
}
```

---

## 6. HEALTH CHECK ENDPOINT

Create API route for Docker health check:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Add any health checks here (database, external services, etc.)
    
    return NextResponse.json(
      { 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error.message,
      },
      { status: 503 }
    )
  }
}
```

---

## 7. ENVIRONMENT VARIABLES

### .env.production
```bash
# Application
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000

# Public URLs (CRITICAL for SEO)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Image optimization
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
```

---

## 8. CI/CD PIPELINE EXAMPLE (GitHub Actions)

```yaml
# .github/workflows/docker-deploy.yml
name: Build and Deploy Docker

on:
  push:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to production
        run: |
          # Your deployment script here
          echo "Deploy to production server"
```

---

## 9. DOCKER BUILD COMMANDS

### Development
```bash
# Build development image
docker build -f Dockerfile.dev -t nextjs-dev .

# Run development container
docker run -p 3000:3000 -v $(pwd):/app nextjs-dev
```

### Production
```bash
# Build production image
docker build -t nextjs-prod .

# Run production container
docker run -p 3000:3000 nextjs-prod

# With docker-compose
docker-compose up -d

# View logs
docker-compose logs -f nextjs

# Stop
docker-compose down
```

---

## 10. IMAGE OPTIMIZATION IN DOCKER

### Option 1: Use Next.js built-in optimization (Recommended)
```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  images: {
    unoptimized: false, // Use Next.js optimization
    domains: ['yourdomain.com'],
  },
}
```

### Option 2: External image service (for high traffic)
```javascript
// next.config.js
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
}

// lib/image-loader.ts
export default function cloudflareLoader({ src, width, quality }) {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')
  return `https://cdn.yourdomain.com/cdn-cgi/image/${paramsString}/${src}`
}
```

---

## 11. MONITORING & LOGGING

### Docker logging configuration
```yaml
# docker-compose.yml
services:
  nextjs:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Application logging
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    }))
  },
  error: (message: string, error?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message || error,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
    }))
  },
}
```

---

## 12. PERFORMANCE BENCHMARKS

Check your Docker container performance:

```bash
# Check container stats
docker stats nextjs

# Check image size
docker images nextjs-prod

# Benchmark response time
ab -n 1000 -c 10 http://localhost:3000/

# Check memory usage
docker exec nextjs node -e "console.log(process.memoryUsage())"
```

---

## CRITICAL SEO CHECKLIST FOR DOCKER DEPLOYMENT

### ✅ Before Deployment
- [ ] `output: 'standalone'` enabled in next.config.js
- [ ] Image optimization configured correctly
- [ ] Environment variables set properly (NEXT_PUBLIC_SITE_URL)
- [ ] Health check endpoint working
- [ ] Dockerfile uses multi-stage build
- [ ] Non-root user configured
- [ ] .dockerignore properly set

### ✅ After Deployment
- [ ] HTTPS working (redirect HTTP to HTTPS)
- [ ] Gzip/Brotli compression enabled
- [ ] Security headers set (via Nginx or middleware)
- [ ] Static files cached properly
- [ ] Sitemap.xml accessible
- [ ] Robots.txt accessible
- [ ] Google Search Console verified
- [ ] Core Web Vitals passing
- [ ] Mobile-friendly test passing

---

## COMMON DOCKER SEO ISSUES & FIXES

### Issue 1: Images not loading
```javascript
// Fix: Set correct image domains
images: {
  domains: ['yourdomain.com', 'localhost'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.yourdomain.com',
    },
  ],
}
```

### Issue 2: Sitemap not generating
```bash
# Ensure standalone build includes sitemap
# Check if sitemap.ts is in app directory
ls app/sitemap.ts

# Test sitemap locally
curl http://localhost:3000/sitemap.xml
```

### Issue 3: Slow response time
```javascript
// Enable caching in middleware.ts
export function middleware(request) {
  const response = NextResponse.next()
  
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  return response
}
```

---

## PRODUCTION DEPLOYMENT CHECKLIST

1. **Build & Test Locally**
   ```bash
   docker build -t nextjs-prod .
   docker run -p 3000:3000 nextjs-prod
   # Test: http://localhost:3000
   ```

2. **Check SEO Essentials**
   - Visit: http://localhost:3000/sitemap.xml
   - Visit: http://localhost:3000/robots.txt
   - Test images loading
   - Check meta tags in page source

3. **Performance Test**
   ```bash
   # Install Lighthouse CLI
   npm install -g lighthouse
   
   # Run audit
   lighthouse http://localhost:3000 --view
   ```

4. **Deploy to Production**
   - Push to registry
   - Pull on server
   - Run with docker-compose
   - Configure Nginx/reverse proxy
   - Setup SSL certificate
   - Configure DNS

5. **Post-Deployment Verification**
   - Submit sitemap to Google Search Console
   - Run PageSpeed Insights
   - Check Core Web Vitals
   - Monitor logs for errors

---

## USEFUL COMMANDS

```bash
# Build
docker build -t nextjs-prod .

# Run
docker run -d -p 3000:3000 --name nextjs nextjs-prod

# Logs
docker logs -f nextjs

# Shell access
docker exec -it nextjs sh

# Stop & Remove
docker stop nextjs && docker rm nextjs

# Clean up
docker system prune -a

# Check Next.js standalone output
docker exec nextjs ls -la .next/standalone
```

---

## RESOURCES

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Next.js Standalone Output](https://nextjs.org/docs/advanced-features/output-file-tracing)
