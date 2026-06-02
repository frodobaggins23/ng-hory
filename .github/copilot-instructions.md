# Copilot Instructions

applyTo: '\*_/_.{ts,html,scss,js,md}'

---

## Coding Standards

- Use Angular best practices for components, services, and modules.
- Prefer TypeScript features (interfaces, types, enums) for type safety. Strict mode is enabled — avoid `any`.
- Prefer Angular Signals for local/component state and reactivity.
- Use RxJS for asynchronous operations, effects, and complex stream management.
- Follow the existing folder structure for new features (e.g., create a new folder for each component).
- Use SCSS for styling.
- Keep components small and focused; use services for business logic and data access.
- Use Angular's dependency injection for services.
- Write unit tests for all new components and services using Jasmine and Karma.
- Use standalone components throughout — no NgModules.

## Architecture & Domain Knowledge

- The project is "Moje Hory" — a personal hiking tracker for Czech mountains with fitness stats and photo galleries.
- Data is organized in `src/data/`: `mountains.ts` (static mountain definitions, `MountainName` union type), `types.ts` (shared types), and `climbs/` (per-mountain climb data).
- The app uses Leaflet for map rendering and ngx-charts for statistics charts.
- Routes: `/` (map view), `/detail` (mountain detail with track, gallery, climb stats), `/stats` and `/stats/:year` (statistics).
- State is managed with Angular Signals and services — no NgRx. Key services: `MountainStateService` (selected mountain signal), `StatisticsService`, `ImageService` (IndexedDB cache), `RequestService` (typed HTTP wrapper with Bearer auth), `TokenService`.
- A Node.js file server lives in `node-servers/` with its own dependencies and CI/CD.

## Preferences

- Use modern Angular syntax (standalone components, signals).
- Prefer template-driven forms unless reactive forms are required.
- Use Angular's built-in pipes and directives where possible.
- Keep imports organized and avoid unused imports.
- Use descriptive variable and function names in English.
- Use environment files for configuration and secrets. Dev secrets go in `src/environments/environment.development.ts` (gitignored). Do not put secrets in `src/environments/environment.ts`.
- Place assets in the `public` or `src/assets` folders as appropriate.

## Commit Messages

**_Important:_** Propose commit message when I write `commit please` in the chat.

- Use terminal commands for getting the information about the changes made. Always check all the files that are currently in the staging area.
- Use the conventional commit format: `type: Description`.
- Types include: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style` (formatting, missing semi-colons, etc.), `refactor` (code change that neither fixes a bug nor adds a feature), `test` (adding missing tests), and `chore` (maintenance tasks).
- Description always starts with capital letter and is concise.
- Example: `feat: Add mountain detail component`, `fix: Correct map rendering issue`, `docs: Update README with setup instructions`.
