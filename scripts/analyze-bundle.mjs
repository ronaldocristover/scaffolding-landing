#!/usr/bin/env node

/**
 * Bundle Analysis Script
 *
 * This script analyzes the Next.js bundle and provides recommendations
 * for reducing JavaScript bundle sizes.
 *
 * Usage: node scripts/analyze-bundle.mjs
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const NEXT_DIR = path.join(ROOT_DIR, '.next');

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

function checkBundleExists() {
  if (!fs.existsSync(NEXT_DIR)) {
    log('✗ Build directory not found. Run "npm run build" first.', 'red');
    process.exit(1);
  }
  return true;
}

function analyzeClientBundle() {
  log('\n📦 Analyzing Client Bundle...', 'cyan');

  const staticDir = path.join(NEXT_DIR, 'static');
  if (!fs.existsSync(staticDir)) {
    log('⚠ Static build files not found', 'yellow');
    return;
  }

  let totalSize = 0;
  const jsFiles = [];

  function findJsFiles(dir, depth = 0) {
    if (depth > 5) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !filePath.includes('pages') && !filePath.includes('server')) {
        findJsFiles(filePath, depth + 1);
      } else if (file.match(/\.(js|jsx)$/)) {
        const size = stat.size;
        totalSize += size;
        jsFiles.push({ path: filePath, size });
      }
    }
  }

  findJsFiles(staticDir);

  if (jsFiles.length === 0) {
    log('⚠ No JavaScript files found in build output', 'yellow');
    return;
  }

  jsFiles.sort((a, b) => b.size - a.size);

  log(`\nTotal JavaScript size: ${(totalSize / 1024).toFixed(2)} KB`, 'bold');
  log(`\nTop 10 largest JavaScript files:`, 'cyan');

  const topFiles = jsFiles.slice(0, 10);
  topFiles.forEach((file, index) => {
    const relativePath = path.relative(ROOT_DIR, file.path);
    const size = (file.size / 1024).toFixed(2);
    const displayPath = relativePath.length > 60 ? '...' + relativePath.slice(-57) : relativePath;

    if (index === 0) {
      log(`\n${index + 1}. ${displayPath}`, 'yellow');
      log(`   Size: ${size} KB`, 'yellow');
    } else {
      log(`\n${index + 1}. ${displayPath}`, 'reset');
      log(`   Size: ${size} KB`, 'reset');
    }
  });

  // Provide recommendations
  log('\n\n💡 Optimization Recommendations:', 'cyan');

  if (totalSize > 500 * 1024) { // > 500 KB
    log('\n⚠ Total bundle size is large. Consider:', 'yellow');
    log('  - Using dynamic imports for non-critical components', 'yellow');
    log('  - Implementing code splitting for large libraries', 'yellow');
    log('  - Removing unused dependencies', 'yellow');
  }

  const largestFile = jsFiles[0];
  if (largestFile && largestFile.size > 100 * 1024) { // > 100 KB
    log(`\n⚠ Largest file (${path.basename(largestFile.path)}) is over 100 KB`, 'yellow');
    log('  - Consider lazy loading this module', 'yellow');
    log('  - Check for unused exports', 'yellow');
  }

  // Check for common optimization opportunities
  const hasLargeChunks = jsFiles.filter(f => f.size > 50 * 1024).length > 3;
  if (hasLargeChunks) {
    log('\n⚠ Multiple large chunks detected. Consider:', 'yellow');
    log('  - Implementing route-based code splitting', 'yellow');
    log('  - Using dynamic imports for third-party libraries', 'yellow');
  }

  log('\n✓ Analysis complete!', 'green');
}

function checkOptimizationConfig() {
  log('\n🔧 Checking Optimization Configuration...', 'cyan');

  const configPath = path.join(ROOT_DIR, 'next.config.ts');
  if (!fs.existsSync(configPath)) {
    log('⚠ next.config.ts not found', 'yellow');
    return;
  }

  const content = fs.readFileSync(configPath, 'utf-8');

  const optimizations = [
    { name: 'Turbopack enabled', pattern: /turbopack\s*:/, critical: true },
    { name: 'Compression enabled', pattern: /compress\s*:\s*true/, critical: true },
    { name: 'Image optimization', pattern: /images\s*:\s*{/, critical: true },
    { name: 'Cache headers', pattern: /headers\s*\(\)/, critical: false },
    { name: 'SWC minification', pattern: /swcMinify\s*:\s*true/, critical: false },
  ];

  optimizations.forEach(opt => {
    if (opt.pattern.test(content)) {
      log(`✓ ${opt.name}`, 'green');
    } else {
      const level = opt.critical ? 'red' : 'yellow';
      log(`${opt.critical ? '✗' : '⚠'} ${opt.name} not found`, level);
    }
  });
}

function checkPackageSize() {
  log('\n📊 Checking Package Dependencies...', 'cyan');

  const pkgPath = path.join(ROOT_DIR, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  const heavyLibs = [
    'moment',
    'lodash',
    '@mui/material',
    'antd',
    'rxjs',
    'axios',
  ];

  const foundHeavyLibs = Object.keys(deps).filter(dep =>
    heavyLibs.some(heavy => dep.toLowerCase().includes(heavy))
  );

  if (foundHeavyLibs.length > 0) {
    log('\n⚠ Heavy libraries detected:', 'yellow');
    foundHeavyLibs.forEach(lib => {
      log(`  - ${lib}`, 'yellow');
    });
    log('\n  Consider using lighter alternatives:', 'yellow');
    log('  - moment → date-fns or luxon', 'yellow');
    log('  - lodash → lodash-es (tree-shakeable)', 'yellow');
    log('  - axios → native fetch or lightweight alternatives', 'yellow');
  } else {
    log('✓ No known heavy libraries found', 'green');
  }
}

function main() {
  console.log('\n' + '='.repeat(80));
  log('🔍 NEXT.JS BUNDLE ANALYSIS', 'bold');
  console.log('='.repeat(80));

  try {
    checkBundleExists();
    checkOptimizationConfig();
    analyzeClientBundle();
    checkPackageSize();

    console.log('\n' + '='.repeat(80));
    log('📋 SUMMARY', 'bold');
    console.log('='.repeat(80));

    log('\n✓ Bundle analysis complete!', 'green');
    log('\nNext steps:', 'cyan');
    log('  1. Review the recommendations above', 'reset');
    log('  2. Implement dynamic imports for large components', 'reset');
    log('  3. Remove unused dependencies', 'reset');
    log('  4. Run "npm run build" to rebuild with optimizations', 'reset');
    console.log('');

  } catch (error) {
    log(`\n✗ Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
