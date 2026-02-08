#!/bin/bash

URL=$1

claude <<EOF
Based on SEO audit for $URL:
1. Open my Next.js project files.
2. Fix missing metadata using Next.js metadata API.
3. Add structured data schema for main pages.
4. Fix missing alt attributes.
5. Optimize images for next/image.
6. Improve Core Web Vitals (code splitting, image priority, font optimization).
Explain each change before applying.
EOF

