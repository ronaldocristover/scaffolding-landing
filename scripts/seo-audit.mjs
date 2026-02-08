#!/usr/bin/env node

/**
 * SEO Audit Script for leegoscaffolding.com
 *
 * This script runs automated SEO audits and generates a comprehensive report.
 * It requires:
 * - Node.js 18+
 * - Lighthouse CLI (npm install -g lighthouse)
 * - curl (for page analysis)
 *
 * Usage: node scripts/seo-audit.mjs [url]
 * Example: node scripts/seo-audit.mjs https://leegoscaffolding.com
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = process.argv[2] || 'https://leegoscaffolding.com';
const OUTPUT_DIR = path.join(process.cwd(), 'seo-audit-results');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`\n▶ ${description}...`, 'cyan');
    const output = execSync(command, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    return output;
  } catch (error) {
    log(`✗ Error running ${description}: ${error.message}`, 'red');
    return null;
  }
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    log(`✗ Error checking URL ${url}: ${error.message}`, 'red');
    return null;
  }
}

async function analyzePageContent(url) {
  log('\n📄 Analyzing Page Content...', 'cyan');

  const checks = {
    robots: await checkUrl(`${url}/robots.txt`),
    sitemap: await checkUrl(`${url}/sitemap.xml`),
    manifest: await checkUrl(`${url}/favicon/site.webmanifest`),
  };

  // Check HTML content
  try {
    const response = await fetch(url);
    const html = await response.text();

    const analysis = {
      hasTitle: /<title[^>]*>.*<\/title>/i.test(html),
      hasMetaDescription: /<meta[^>]*name=["']description["'][^>]*>/i.test(html),
      hasCanonical: /<link[^>]*rel=["']canonical["'][^>]*>/i.test(html),
      hasHreflang: /<link[^>]*rel=["']alternate["'][^>]*hreflang/i.test(html),
      hasStructuredData: /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html),
      hasViewport: /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html),
      hasOGTags: /<meta[^>]*property=["']og:/i.test(html),
      hasTwitterCard: /<meta[^>]*name=["']twitter:card["'][^>]*>/i.test(html),
      hasSemanticHtml: /<(header|main|nav|article|section|footer)[^>]*>/i.test(html),
      hasAltText: /<img[^>]*alt=/i.test(html),
    };

    return { checks, analysis };
  } catch (error) {
    log(`✗ Error analyzing page content: ${error.message}`, 'red');
    return null;
  }
}

async function runLighthouseAudit(url) {
  log('\n🔦 Running Lighthouse Audit...', 'cyan');

  const reportPath = path.join(OUTPUT_DIR, `lighthouse-${TIMESTAMP}.json`);

  const command = `npx lighthouse "${url}" --only-categories=seo,performance,accessibility --output=json --output-path="${reportPath}" --chrome-flags="--headless" --quiet`;

  runCommand(command, 'Lighthouse');

  try {
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      return report;
    }
  } catch (error) {
    log(`✗ Error reading Lighthouse report: ${error.message}`, 'red');
  }

  return null;
}

function generateReport(lighthouseReport, pageAnalysis) {
  log('\n📊 Generating SEO Audit Report...', 'cyan');

  const report = {
    timestamp: new Date().toISOString(),
    url: TARGET_URL,
    summary: {},
    lighthouse: {},
    pageAnalysis: {},
    recommendations: [],
  };

  // Process Lighthouse results
  if (lighthouseReport) {
    const categories = lighthouseReport.categories;
    report.lighthouse = {
      performance: {
        score: categories.performance?.score * 100 || 0,
        title: categories.performance?.title || 'Performance',
      },
      accessibility: {
        score: categories.accessibility?.score * 100 || 0,
        title: categories.accessibility?.title || 'Accessibility',
      },
      seo: {
        score: categories.seo?.score * 100 || 0,
        title: categories.seo?.title || 'SEO',
      },
    };

    // Extract failing audits
    const failedAudits = Object.values(lighthouseReport.audits)
      .filter(audit => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'informative')
      .map(audit => ({
        id: audit.id,
        title: audit.title,
        score: audit.score,
        value: audit.displayValue || 'N/A',
        description: audit.description,
      }))
      .slice(0, 15);

    report.lighthouse.failedAudits = failedAudits;

    // Calculate overall score
    const scores = [
      report.lighthouse.performance.score,
      report.lighthouse.accessibility.score,
      report.lighthouse.seo.score,
    ];
    report.summary.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  // Process page analysis
  if (pageAnalysis) {
    report.pageAnalysis = {
      robots: {
        accessible: pageAnalysis.checks.robots?.ok || false,
        status: pageAnalysis.checks.robots?.status || 0,
      },
      sitemap: {
        accessible: pageAnalysis.checks.sitemap?.ok || false,
        status: pageAnalysis.checks.sitemap?.status || 0,
      },
      manifest: {
        accessible: pageAnalysis.checks.manifest?.ok || false,
        status: pageAnalysis.checks.manifest?.status || 0,
      },
      htmlElements: pageAnalysis.analysis,
    };
  }

  // Generate recommendations
  report.recommendations = generateRecommendations(report);

  return report;
}

function generateRecommendations(report) {
  const recommendations = [];

  // Performance recommendations
  if (report.lighthouse.performance?.score < 95) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Performance',
      title: 'Optimize Performance',
      items: report.lighthouse.failedAudits
        .filter(a => ['performance', 'best-practices'].includes(a.category))
        .map(a => `- ${a.title} (Score: ${Math.round(a.score * 100)}%)`),
    });
  }

  // Accessibility recommendations
  if (report.lighthouse.accessibility?.score < 95) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Accessibility',
      title: 'Improve Accessibility',
      items: [
        '- Ensure color contrast ratios meet WCAG AA standards (4.5:1)',
        '- Make sure all touch targets are at least 44x44 CSS pixels',
        '- Add proper ARIA labels to interactive elements',
        '- Implement keyboard navigation support',
      ],
    });
  }

  // SEO recommendations
  if (report.lighthouse.seo?.score < 100) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'SEO',
      title: 'SEO Improvements',
      items: report.lighthouse.failedAudits
        .filter(a => a.category === 'seo')
        .map(a => `- ${a.title}`),
    });
  }

  // Page structure recommendations
  if (!report.pageAnalysis.htmlElements?.hasStructuredData) {
    recommendations.push({
      priority: 'HIGH',
      category: 'SEO',
      title: 'Add Structured Data',
      items: [
        '- Implement JSON-LD structured data for LocalBusiness',
        '- Add FAQPage schema for common questions',
        '- Include BreadcrumbList schema',
      ],
    });
  }

  // Critical fixes
  recommendations.push({
    priority: 'CRITICAL',
    category: 'Performance',
    title: 'Critical Performance Fixes',
    items: [
      '- Eliminate unnecessary redirects (saves ~870ms)',
      '- Optimize images with Next.js Image component (saves ~77KB)',
      '- Reduce unused JavaScript (saves ~54KB)',
      '- Configure proper cache headers',
    ],
  });

  return recommendations;
}

function displayReport(report) {
  console.log('\n' + '='.repeat(80));
  log('🔍 SEO AUDIT REPORT', 'bold');
  log(`   URL: ${report.url}`, 'cyan');
  log(`   Date: ${new Date(report.timestamp).toLocaleString()}`, 'cyan');
  console.log('='.repeat(80) + '\n');

  // Summary
  console.log('📈 SUMMARY');
  console.log('-'.repeat(80));
  if (report.summary.averageScore) {
    const score = report.summary.averageScore;
    const scoreColor = score >= 95 ? 'green' : score >= 80 ? 'yellow' : 'red';
    log(`Overall Score: ${score}/100`, scoreColor);
  }
  console.log('');

  // Lighthouse Scores
  if (report.lighthouse.performance) {
    console.log('🔦 LIGHTHOUSE SCORES');
    console.log('-'.repeat(80));

    const { performance, accessibility, seo } = report.lighthouse;

    const displayScore = (score, label) => {
      const value = Math.round(score);
      const color = value >= 95 ? 'green' : value >= 80 ? 'yellow' : 'red';
      log(`  ${label}: ${value}/100`, color);
    };

    displayScore(performance.score, 'Performance');
    displayScore(accessibility.score, 'Accessibility');
    displayScore(seo.score, 'SEO');
    console.log('');
  }

  // Page Analysis
  if (report.pageAnalysis.robots) {
    console.log('📄 PAGE ANALYSIS');
    console.log('-'.repeat(80));

    const { robots, sitemap, manifest, htmlElements } = report.pageAnalysis;

    const displayStatus = (label, status) => {
      const color = status ? 'green' : 'red';
      const icon = status ? '✓' : '✗';
      log(`  ${icon} ${label}: ${status ? 'OK' : 'Missing'}`, color);
    };

    displayStatus('robots.txt', robots.accessible);
    displayStatus('sitemap.xml', sitemap.accessible);
    displayStatus('Web Manifest', manifest.accessible);
    displayStatus('Title Tag', htmlElements?.hasTitle);
    displayStatus('Meta Description', htmlElements?.hasMetaDescription);
    displayStatus('Canonical URL', htmlElements?.hasCanonical);
    displayStatus('Hreflang Tags', htmlElements?.hasHreflang);
    displayStatus('Structured Data', htmlElements?.hasStructuredData);
    displayStatus('Viewport Meta', htmlElements?.hasViewport);
    displayStatus('OpenGraph Tags', htmlElements?.hasOGTags);
    displayStatus('Twitter Card', htmlElements?.hasTwitterCard);
    displayStatus('Semantic HTML', htmlElements?.hasSemanticHtml);
    displayStatus('Image Alt Text', htmlElements?.hasAltText);
    console.log('');
  }

  // Recommendations
  if (report.recommendations.length > 0) {
    console.log('💡 RECOMMENDATIONS');
    console.log('-'.repeat(80));

    report.recommendations.forEach((rec, index) => {
      const priorityColor = rec.priority === 'CRITICAL' ? 'red' : rec.priority === 'HIGH' ? 'yellow' : 'blue';
      log(`\n${index + 1}. [${rec.priority}] ${rec.title}`, priorityColor);
      log(`   Category: ${rec.category}`, 'cyan');
      log('   Actions:');
      rec.items.forEach(item => {
        console.log(`     ${item}`);
      });
    });
    console.log('');
  }

  console.log('='.repeat(80));
  log('\n✓ Audit complete!', 'green');
  log(`📁 Full report saved to: ${OUTPUT_DIR}`, 'cyan');
  log('\nNext steps:', 'bold');
  log('  1. Review critical and high-priority recommendations', 'cyan');
  log('  2. Implement fixes following the priority order', 'cyan');
  log('  3. Re-run audit to verify improvements', 'cyan');
  console.log('');
}

async function main() {
  console.log('\n' + '='.repeat(80));
  log('🔍 SEO AUDIT TOOL', 'bold');
  log(`   Target: ${TARGET_URL}`, 'cyan');
  console.log('='.repeat(80));

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Run audits
  const [lighthouseReport, pageAnalysis] = await Promise.all([
    runLighthouseAudit(TARGET_URL),
    analyzePageContent(TARGET_URL),
  ]);

  // Generate and display report
  const report = generateReport(lighthouseReport, pageAnalysis);

  // Save report to file
  const reportPath = path.join(OUTPUT_DIR, `seo-audit-${TIMESTAMP}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Display formatted report
  displayReport(report);

  // Return exit code based on scores
  const overallScore = report.summary.averageScore || 0;
  process.exit(overallScore >= 80 ? 0 : 1);
}

main().catch(error => {
  log(`\n✗ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
