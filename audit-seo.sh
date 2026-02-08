#!/bin/bash

URL=$1

if [ -z "$URL" ]; then
  echo "Usage: ./seo-audit.sh https://yoursite.com"
  exit 1
fi

echo "🚀 Running full SEO audit for: $URL"

claude <<EOF
Run a full SEO audit for $URL using MCP tools:
1. Run Lighthouse and summarize SEO, performance, and accessibility issues.
2. Fetch the page and analyze meta tags, canonical URL, robots directives, and OpenGraph tags.
3. Render the page like Googlebot and check if main content is visible (SSR vs CSR).
4. Check for structured data (schema.org) and report missing or invalid schema.
5. Analyze images for missing alt text and large file size.
6. Check accessibility issues that impact SEO.
7. Provide a prioritized fix list with code-level recommendations for Next.js.
Output results in sections:
- Lighthouse Report
- Meta & Schema Issues
- Rendering Issues
- Image Issues
- Accessibility Issues
- Priority Fix List
EOF

