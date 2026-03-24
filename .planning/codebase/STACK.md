# Technology Stack

**Analysis Date:** 2026-03-24

## Languages

**Primary:**
- TypeScript 6.0.2 - Used throughout frontend application, enforces type safety across all source files

**Secondary:**
- JavaScript (implicit via Node.js) - Build tooling and configuration

## Runtime

**Environment:**
- Node.js (version not specified in lockfile, infer from package.json ES2020 target)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- React 19.2.4 - UI framework for component-based application in `src/`
- React DOM 19.2.4 - DOM rendering for React components

**Animation:**
- Framer Motion 12.38.0 - Provides animation primitives used in `src/components/ui/AnimatedSection.tsx` for scroll-triggered and viewport animations

**Styling:**
- Tailwind CSS 3.4.19 - Utility-first CSS framework configured in `tailwind.config.ts`
- PostCSS 8.5.8 - CSS processing pipeline, configured in `postcss.config.js`
- Autoprefixer 10.4.27 - Automatic vendor prefixing for CSS compatibility

**Icon Library:**
- lucide-react 1.5.0 - React icon components used throughout UI (`src/components/` and `src/data/services.ts`)

**Build/Dev:**
- Vite 5.4.21 - Fast module bundler and development server, configured in `vite.config.ts`
- @vitejs/plugin-react 4.7.0 - Vite plugin for React Fast Refresh development
- @tailwindcss/vite 4.2.2 - Vite integration for Tailwind CSS

## Key Dependencies

**Critical:**
- react, react-dom - Application framework, no alternatives configured
- vite - Build system and dev server, integral to workflow

**Type Definitions:**
- @types/react 19.2.14 - TypeScript type definitions for React
- @types/react-dom 19.2.3 - TypeScript type definitions for React DOM

## Configuration

**Environment:**
- No .env file detected - Application is static/client-only with no backend service configuration
- No environment variables configured in build process
- Default development: `npm run dev` (Vite dev server on localhost:5173)
- Default production: `npm run build` (TypeScript check + Vite build)

**Build:**
- TypeScript compilation before Vite build (see `package.json` scripts: `"build": "tsc && vite build"`)
- Vite configuration: `vite.config.ts` - minimal setup with React plugin
- Tailwind configuration: `tailwind.config.ts` - custom colors (lime: #B9FF66), custom font family (Bricolage Grotesque), and custom animations (marquee)
- PostCSS configuration: `postcss.config.js` - Tailwind and Autoprefixer

**TypeScript:**
- Target: ES2020
- Module format: ESNext
- Strict mode enabled
- JSX preset: react-jsx
- Module resolution: bundler

## External Assets

**Fonts:**
- Bricolage Grotesque - Loaded from Google Fonts API in `index.html` via `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap`
- Preconnect to googleapis.com and gstatic.com for font optimization

## Platform Requirements

**Development:**
- Node.js (any modern LTS version supporting npm and ES2020)
- npm 7.0+ (supports npm ci for reproducible installs)
- No additional system dependencies required

**Production:**
- Static hosting capable of serving SPA (Single Page Application)
- No server-side runtime required
- HTTP/2 and gzip compression recommended

---

*Stack analysis: 2026-03-24*
