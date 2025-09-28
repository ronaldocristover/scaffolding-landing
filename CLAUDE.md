# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 project using TypeScript, TailwindCSS v4, and React 19. The project uses Turbopack for faster builds and development.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Architecture

- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS v4 with inline @theme configuration
- **Fonts**: Geist and Geist Mono fonts loaded via next/font/google
- **TypeScript**: Configured with strict mode and path aliases (@/* → ./src/*)
- **Build Tool**: Turbopack (Next.js bundler)

### Project Structure

```
src/
  app/           # Next.js App Router directory
    layout.tsx   # Root layout with fonts and global styles
    page.tsx     # Homepage component
    globals.css  # Global styles with CSS variables and dark mode
```

### Key Configuration

- ESLint extends Next.js core-web-vitals and TypeScript configs
- TypeScript path alias `@/*` maps to `./src/*`
- CSS variables for theming with automatic dark mode support
- Turbopack enabled for both dev and build commands