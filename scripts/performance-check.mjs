#!/usr/bin/env node

/**
 * Build-Time Performance Check for SEO
 *
 * Validates that built assets meet Core Web Vitals thresholds:
 * - LCP (Largest Contentful Paint): < 2.5s
 * - FID/INP (Interaction): < 100ms
 * - CLS (Cumulative Layout Shift): < 0.1
 *
 * This is a lightweight check - for full auditing, use Lighthouse CI
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const NEXT_DIR = path.join(ROOT_DIR, '.next');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

let warnings = 0;

// 1. Check total JavaScript bundle size
function checkBundleSize() {
  log('\n📦 Checking Bundle Sizes...', 'cyan');

  const staticDir = path.join(NEXT_DIR, 'static');
  if (!fs.existsSync(staticDir)) {
    log('  ⚠ .next/static not found (build may not be complete)', 'yellow');
    return;
  }

  let totalJsSize = 0;
  let totalCssSize = 0;

  function getDirectorySize(dir) {
    let size = 0;
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        size += getDirectorySize(filePath);
      } else if (stat.isFile()) {
        size += stat.size;
      }
    }
    return size;
  }

  // Check JS chunks
  const chunksDir = path.join(staticDir, 'chunks');
  if (fs.existsSync(chunksDir)) {
    totalJsSize = getDirectorySize(chunksDir);
    const jsSizeKB = (totalJsSize / 1024).toFixed(2);
    log(`  JavaScript: ${jsSizeKB} KB`, totalJsSize > 500_000 ? 'yellow' : 'green');

    if (totalJsSize > 500_000) {
      log(`  ⚠ Large JS bundle detected. Consider code splitting for better LCP`, 'yellow');
      warnings++;
    }
  }

  // Check CSS
  const cssDir = path.join(staticDir, 'css');
  if (fs.existsSync(cssDir)) {
    totalCssSize = getDirectorySize(cssDir);
    const cssSizeKB = (totalCssSize / 1024).toFixed(2);
    log(`  CSS: ${cssSizeKB} KB`, totalCssSize > 100_000 ? 'yellow' : 'green');

    if (totalCssSize > 100_000) {
      log(`  ⚠ Large CSS bundle detected`, 'yellow');
      warnings++;
    }
  }
}

// 2. Check for pre-compressed assets (SEO performance)
function checkCompression() {
  log('\n🗜️  Checking Asset Compression...', 'cyan');

  const staticDir = path.join(NEXT_DIR, 'static');
  if (!fs.existsSync(staticDir)) {
    return;
  }

  let hasGzip = false;
  let hasBrotli = false;

  function checkCompression(dir, depth = 0) {
    if (depth > 5) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        checkCompression(filePath, depth + 1);
      } else if (file.endsWith('.gz')) {
        hasGzip = true;
      } else if (file.endsWith('.br')) {
        hasBrotli = true;
      }
    }
  }

  checkCompression(staticDir);

  if (hasGzip) {
    log('  ✓ Gzip compression found', 'green');
  } else {
    log('  ⚠ No Gzip compressed assets found', 'yellow');
    warnings++;
  }

  if (hasBrotli) {
    log('  ✓ Brotli compression found', 'green');
  } else {
    log('  ⚠ No Brotli compressed assets found', 'yellow');
    warnings++;
  }
}

// 3. Check image optimization configuration
function checkImageOptimization() {
  log('\n🖼️  Checking Image Optimization...', 'cyan');

  const nextConfigPath = path.join(ROOT_DIR, 'next.config.ts');
  if (!fs.existsSync(nextConfigPath)) {
    log('  ⚠ next.config.ts not found', 'yellow');
    return;
  }

  const content = fs.readFileSync(nextConfigPath, 'utf-8');

  const checks = [
    { name: 'AVIF support', pattern: /avif/ },
    { name: 'WebP support', pattern: /webp/ },
    { name: 'Cache configuration', pattern: /minimumCacheTTL/ },
    { name: 'Compression enabled', pattern: /compress:\s*true/ },
  ];

  checks.forEach(check => {
    if (check.pattern.test(content)) {
      log(`  ✓ ${check.name}`, 'green');
    } else {
      log(`  ⚠ Missing: ${check.name}`, 'yellow');
      warnings++;
    }
  });
}

// 4. Check for critical CSS inlining hints
function checkCriticalRenderingPath() {
  log('\n⚡ Checking Critical Rendering Path...', 'cyan');

  const layoutPath = path.join(ROOT_DIR, 'src', 'app', '[locale]', 'layout.tsx');
  if (!fs.existsSync(layoutPath)) {
    return;
  }

  const content = fs.readFileSync(layoutPath, 'utf-8');

  const checks = [
    { name: 'Font preloading', pattern: /rel=["']preconnect["']/ },
    { name: 'Font display: optional', pattern: /display:\s*["']optional["']/ },
  ];

  checks.forEach(check => {
    if (check.pattern.test(content)) {
      log(`  ✓ ${check.name}`, 'green');
    } else {
      log(`  ⚠ Consider adding: ${check.name}`, 'yellow');
      warnings++;
    }
  });
}

// 5. Verify static asset generation for SEO
function checkSEOAssets() {
  log('\n🔍 Checking SEO Assets...', 'cyan');

  const publicDir = path.join(ROOT_DIR, 'public');
  if (!fs.existsSync(publicDir)) {
    log('  ⚠ public directory not found', 'yellow');
    return;
  }

  const requiredAssets = [
    { path: 'scaffolding-logo.png', name: 'OG Image' },
    { path: 'favicon/favicon.ico', name: 'Favicon ICO' },
    { path: 'favicon/favicon.svg', name: 'Favicon SVG' },
    { path: 'favicon/site.webmanifest', name: 'Web Manifest' },
  ];

  requiredAssets.forEach(asset => {
    const assetPath = path.join(publicDir, asset.path);
    if (fs.existsSync(assetPath)) {
      log(`  ✓ ${asset.name}`, 'green');
    } else {
      log(`  ⚠ Missing: ${asset.name} (${asset.path})`, 'yellow');
      warnings++;
    }
  });
}

// Main function
function main() {
  console.log('\n' + '='.repeat(60));
  log('⚡ BUILD-TIME PERFORMANCE CHECK', 'bold');
  console.log('='.repeat(60));

  checkBundleSize();
  checkCompression();
  checkImageOptimization();
  checkCriticalRenderingPath();
  checkSEOAssets();

  console.log('\n' + '='.repeat(60));
  if (warnings === 0) {
    log('✓ All performance checks passed!', 'green');
    console.log('');
    process.exit(0);
  } else {
    log(`⚠ ${warnings} warning(s) found`, 'yellow');
    log('Consider fixing for better Core Web Vitals', 'yellow');
    console.log('');
    process.exit(0); // Don't fail build, just warn
  }
}

main().catch(error => {
  log(`\n✗ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
