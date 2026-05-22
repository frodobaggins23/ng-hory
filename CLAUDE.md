# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start          # Dev server at http://localhost:4200
npm run build          # Production build (requires .env in root, see below)
ng test                # Run all tests (Karma/Jasmine, watch mode)
ng test --include='**/<file>.spec.ts'  # Run a single test file
npm run lint           # Lint TypeScript and HTML
npm run lint:fix       # Lint and auto-fix
npm run format:check   # Check Prettier formatting
```

## Environment Setup

**Development**: Create `src/environments/environment.development.ts` with secrets. This file is gitignored and used via Angular file replacements during `npm run start`. Do not put secrets in `src/environments/environment.ts` — that placeholder is used by CI.

**Production build**: Requires a `.env` file in the project root. The `prebuild` script (`scripts/inject-env.js`) reads it before `ng build` runs.

## Architecture

**Angular 20 SPA** — standalone components throughout, no NgModules.

**Routes**
- `/` — `MainComponent`: interactive Leaflet map of all mountains
- `/detail` — `DetailPageComponent`: mountain detail with track, gallery, climb stats
- `/stats` and `/stats/:year` — `StatisticsPageComponent`: yearly fitness statistics

**State management** — Angular Signals for component/local state; services with in-memory caching for shared state. No NgRx.

**Key services** (`src/app/`)
- `MountainStateService` — selected mountain signal, shared across map and detail
- `StatisticsService` — multi-year statistics computation and caching
- `ImageService` — cache-first image loading with request deduplication
- `ImageCacheService` — IndexedDB persistence for images
- `RequestService` — typed HTTP wrapper (`get<T>`, `post<T>`, etc.) with Bearer auth
- `TokenService` — gallery token stored in localStorage
- `InitService` — app init (token verification, gallery lock signal)

**Data** (`src/data/`)
- `mountains.ts` — static mountain definitions (`Mountain[]`, `MountainName` union type)
- `types.ts` — shared TypeScript types (`Climb`, `Mountain`, etc.)
- `climbs/` — per-mountain climb data

**External libraries**: Leaflet (maps), ngx-charts (statistics charts)

**Backend**: `node-servers/` contains a Node.js file server with its own `package.json` and CI/CD pipeline. It serves images and handles gallery unlock/token verification.

## Asset Preparation Scripts

```bash
npm run prepare:tracks   # GPX → track data; needs .tracks-tmp/ with GPX files
npm run prepare:images   # Compress images; needs ImageMagick at ~/Apps/magick/magick and .images-tmp/ with JPGs
npm run prepare:climb    # Process climb data; needs Garmin activity CSV as input
npm run parse:activity   # Parse a single Garmin activity
```

## Coding Standards

- **Components**: Standalone, small, focused on presentation; business logic belongs in services
- **State**: Prefer Angular Signals for local reactivity; RxJS for complex async streams
- **Styles**: SCSS
- **Tests**: Jasmine + Karma; `TestBed` for components, `HttpClientTestingModule` for services with HTTP
- **Commits**: Conventional format — `type: Description` (description starts with capital letter)
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **TypeScript**: Strict mode enabled; use interfaces/types, avoid `any`
