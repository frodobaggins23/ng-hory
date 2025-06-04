# Copilot Instructions

applyTo: '\*_/_.{ts,html,scss,js,md}'

---

## Coding Standards

- Use Angular best practices for components, services, and modules.
- Prefer TypeScript features (interfaces, types, enums) for type safety.
- Prefer Angular Signals for local/component state and reactivity.
- Use RxJS for asynchronous operations, effects, and complex stream management.
- Follow the existing folder structure for new features (e.g., create a new folder for each component).
- Use SCSS for styling.
- Keep components small and focused; use services for business logic and data access.
- Use Angular’s dependency injection for services.
- Write unit tests for all new components and services using Jasmine and Karma.

## Domain Knowledge

- The project is about Czech mountains and their details, including tracks, climbs, and map features.
- Data is organized by mountain, with subfolders for tracks and climbs.
- The app uses Leaflet for map rendering.
- The `mountain-detail` component displays detailed information about each mountain.
- The `switcher` component is used for toggling between different views or data sets.

## Preferences

- Use modern Angular syntax (standalone components, signals, etc. if applicable).
- Prefer template-driven forms unless reactive forms are required.
- Use Angular’s built-in pipes and directives where possible.
- Keep imports organized and avoid unused imports.
- Use descriptive variable and function names in English.
- Write clear, concise comments where necessary, but prefer self-explanatory code.
- Use environment files for configuration and secrets.
- Place assets in the `public` or `src/assets` folders as appropriate.

## Commit Messages

**_Important:_** Propose commit message when I write `commit please` in the chat.

- Use terminal commands for getting the information about the changes made. Always check all the files that are currently in the staging area.
- Use the conventional commit format: `type: description`.
- Types include: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style` (formatting, missing semi-colons, etc.), `refactor` (code change that neither fixes a bug nor adds a feature), `test` (adding missing tests), and `chore` (maintenance tasks).
- Description always starts with capital letter and is concise.
- Example: `feat: Add mountain detail component`, `fix: Correct map rendering issue`, `docs: Update README with setup instructions`.
