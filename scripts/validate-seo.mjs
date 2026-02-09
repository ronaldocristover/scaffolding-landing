#!/usr/bin/env node

/**
 * SEO Validation Script for Build-Time Checks
 *
 * This script validates SEO-critical files and configurations during the build process.
 * It checks for:
 * - Valid sitemap.xml structure
 * - Valid robots.txt
 * - Structured data (JSON-LD) validation
 * - Meta tags completeness
 * - Performance optimizations
 *
 * Usage: node scripts/validate-seo.mjs
 * Exit codes: 0 (success), 1 (warnings), 2 (errors)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT_DIR, 'src', 'app');

// ANSI color codes
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

let errors = 0;
let warnings = 0;

function report(level, message) {
  if (level === 'error') {
    errors++;
    log(`✗ ERROR: ${message}`, 'red');
  } else if (level === 'warning') {
    warnings++;
    log(`⚠ WARNING: ${message}`, 'yellow');
  } else {
    log(`✓ ${message}`, 'green');
  }
}

// 1. Validate sitemap configuration
function validateSitemap() {
  log('\n📋 Validating Sitemap Configuration...', 'cyan');

  const sitemapPath = path.join(APP_DIR, 'sitemap.ts');

  if (!fs.existsSync(sitemapPath)) {
    report('error', 'sitemap.ts not found in src/app/');
    return false;
  }

  report('success', 'sitemap.ts exists');

  // Check if sitemap.ts exports a default function
  const content = fs.readFileSync(sitemapPath, 'utf-8');

  if (!content.includes('export default function')) {
    report('error', 'sitemap.ts must export a default function');
    return false;
  }

  report('success', 'sitemap.ts exports default function');

  // Check for required elements
  const requiredElements = [
    { name: 'baseUrl', pattern: /baseUrl\s*[:=]\s*["']https?:/ },
    { name: 'url entries', pattern: /url:\s*`?\$\{baseUrl\}/ },
    { name: 'lastModified', pattern: /lastModified/ },
    { name: 'changeFrequency', pattern: /changeFrequency/ },
  ];

  requiredElements.forEach(element => {
    if (!element.pattern.test(content)) {
      report('warning', `sitemap.ts missing or has invalid ${element.name}`);
    } else {
      report('success', `sitemap.ts has valid ${element.name}`);
    }
  });

  return true;
}

// 2. Validate robots.txt configuration
function validateRobots() {
  log('\n🤖 Validating Robots Configuration...', 'cyan');

  const robotsPath = path.join(APP_DIR, 'robots.ts');

  if (!fs.existsSync(robotsPath)) {
    report('error', 'robots.ts not found in src/app/');
    return false;
  }

  report('success', 'robots.ts exists');

  const content = fs.readFileSync(robotsPath, 'utf-8');

  if (!content.includes('export default function')) {
    report('error', 'robots.ts must export a default function');
    return false;
  }

  report('success', 'robots.ts exports default function');

  // Check for required elements
  const requiredElements = [
    { name: 'userAgent', pattern: /userAgent:/ },
    { name: 'allow rules', pattern: /allow:/ },
    { name: 'disallow rules', pattern: /disallow:/ },
    { name: 'sitemap reference', pattern: /sitemap:/ },
  ];

  requiredElements.forEach(element => {
    if (!element.pattern.test(content)) {
      report('warning', `robots.ts missing ${element.name}`);
    } else {
      report('success', `robots.ts has ${element.name}`);
    }
  });

  return true;
}

// 3. Validate metadata in layout
function validateLayoutMetadata() {
  log('\n📄 Validating Layout Metadata...', 'cyan');

  const layoutPath = path.join(APP_DIR, 'layout.tsx');

  if (!fs.existsSync(layoutPath)) {
    report('error', 'layout.tsx not found in src/app/');
    return false;
  }

  const content = fs.readFileSync(layoutPath, 'utf-8');

  // Check for metadata export
  const hasMetadata = content.includes('export const metadata') ||
                      content.includes('generateMetadata');

  if (!hasMetadata) {
    report('warning', 'layout.tsx missing metadata export');
  } else {
    report('success', 'layout.tsx has metadata export');
  }

  // Check for critical SEO metadata
  const metadataElements = [
    { name: 'title', pattern: /title:\s*{?["`]|metadata\.title\s*=/ },
    { name: 'description', pattern: /description:\s*["`]|metadata\.description\s*=/ },
    { name: 'openGraph', pattern: /openGraph:\s*{|metadata\.openGraph/ },
    { name: 'alternates', pattern: /alternates:\s*{|alternates:\s*{/, required: false },
    { name: 'canonical', pattern: /canonical:\s*|canonicalURL/, required: false },
  ];

  metadataElements.forEach(element => {
    if (!element.pattern.test(content)) {
      if (element.required !== false) {
        report('warning', `layout.tsx missing ${element.name} metadata`);
      }
    } else {
      report('success', `layout.tsx has ${element.name} metadata`);
    }
  });

  return true;
}

// 4. Check for structured data implementation
function validateStructuredData() {
  log('\n🔍 Validating Structured Data...', 'cyan');

  // Check for JSON-LD scripts in the codebase
  const hasJsonLd = (dir, depth = 0) => {
    if (depth > 5) return false;

    const files = fs.readdirSync(dir);
    let found = false;

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
        if (hasJsonLd(filePath, depth + 1)) found = true;
      } else if (file.match(/\.(tsx?|jsx?)$/)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('application/ld+json')) {
          found = true;
        }
      }
    }

    return found;
  };

  if (hasJsonLd(ROOT_DIR)) {
    report('success', 'Found structured data (JSON-LD) implementation');
  } else {
    report('warning', 'No structured data (JSON-LD) found. Consider adding LocalBusiness schema');
  }

  return true;
}

// 5. Validate image optimization configuration
function validateImageConfig() {
  log('\n🖼️  Validating Image Optimization...', 'cyan');

  const configPath = path.join(ROOT_DIR, 'next.config.ts');

  if (!fs.existsSync(configPath)) {
    report('error', 'next.config.ts not found');
    return false;
  }

  const content = fs.readFileSync(configPath, 'utf-8');

  // Check for image optimization settings
  const imageConfigs = [
    { name: 'Modern formats (AVIF/WebP)', pattern: /formats:\s*\[.*avif|webp/ },
    { name: 'Device sizes', pattern: /deviceSizes:/ },
    { name: 'Image sizes', pattern: /imageSizes:/ },
    { name: 'Cache TTL', pattern: /minimumCacheTTL:/ },
  ];

  imageConfigs.forEach(config => {
    if (!config.pattern.test(content)) {
      report('warning', `next.config.ts missing ${config.name} configuration`);
    } else {
      report('success', `next.config.ts has ${config.name}`);
    }
  });

  return true;
}

// 6. Check for internationalization support
function validateI18n() {
  log('\n🌍 Validating Internationalization...', 'cyan');

  const i18nPath = path.join(ROOT_DIR, 'src', 'i18n');

  if (!fs.existsSync(i18nPath)) {
    report('warning', 'i18n directory not found in src/');
    return false;
  }

  report('success', 'i18n directory exists');

  const requestPath = path.join(i18nPath, 'request.ts');
  if (fs.existsSync(requestPath)) {
    report('success', 'i18n request.ts configuration found');
  }

  return true;
}

// 7. Check for security headers
function validateSecurityHeaders() {
  log('\n🔒 Validating Security Headers...', 'cyan');

  const configPath = path.join(ROOT_DIR, 'next.config.ts');

  if (!fs.existsSync(configPath)) {
    return false;
  }

  const content = fs.readFileSync(configPath, 'utf-8');

  const securityHeaders = [
    { name: 'Strict-Transport-Security', pattern: /Strict-Transport-Security/ },
    { name: 'X-Frame-Options', pattern: /X-Frame-Options/ },
    { name: 'X-Content-Type-Options', pattern: /X-Content-Type-Options/ },
    { name: 'Referrer-Policy', pattern: /Referrer-Policy/ },
  ];

  securityHeaders.forEach(header => {
    if (!header.pattern.test(content)) {
      report('warning', `next.config.ts missing ${header.name} header`);
    } else {
      report('success', `next.config.ts has ${header.name} header`);
    }
  });

  return true;
}

// Main validation function
function main() {
  console.log('\n' + '='.repeat(80));
  log('🔍 SEO VALIDATION FOR BUILD', 'bold');
  console.log('='.repeat(80));

  // Run all validations
  validateSitemap();
  validateRobots();
  validateLayoutMetadata();
  validateStructuredData();
  validateImageConfig();
  validateI18n();
  validateSecurityHeaders();

  // Print summary
  console.log('\n' + '='.repeat(80));
  log('📊 VALIDATION SUMMARY', 'bold');
  console.log('='.repeat(80));

  if (errors === 0 && warnings === 0) {
    log('\n✓ All SEO checks passed!', 'green');
    console.log('');
    process.exit(0);
  } else {
    log(`\n${errors} error(s), ${warnings} warning(s) found`, errors > 0 ? 'red' : 'yellow');
    console.log('');

    if (errors > 0) {
      log('Build failed due to SEO errors. Please fix the errors above.', 'red');
      process.exit(2);
    } else {
      log('Build completed with warnings. Consider fixing them for better SEO.', 'yellow');
      process.exit(1);
    }
  }
}

main().catch(error => {
  log(`\n✗ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(2);
});
