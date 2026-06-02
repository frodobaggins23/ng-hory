# AI Development Workflow Experiments for ng-hory

## Context

The goal is to use this repo as a learning ground for Claude, MCP servers, and AI dev tooling — not to add AI features to the app itself. The focus is on making future development smoother: PRs, browser debugging, testing, code review, automated maintenance — including cloud-parallel tasks via GitHub.

**What's already in place:**
- PostToolUse hooks: auto-run Prettier + ESLint after every file edit
- UserPromptSubmit hook: inject pending ESLint issues into the conversation
- Slash commands: `/commit-message`, `/code-review-staged-files`, `/eslint-fixer`, `/instructor-mode`, `/tutor`
- Playwright MCP: already used (screenshots in `.playwright-mcp/`)
- `gh` CLI: installed (v2.45.0) and **authenticated** (`frodobaggins23`, `repo` scope)
- One GitHub Actions workflow: manual deploy only (`workflow_dispatch`)
- No CLAUDE.md at the repo root yet

---

## Experiment 1 — GitHub MCP Server (Highest Value)
**What:** Install and configure the official [GitHub MCP Server](https://github.com/github/github-mcp-server). This gives Claude Code direct access to GitHub: read PRs and issues, post review comments, check Actions run status, create issues, all from within the conversation.
**Why it matters:** Without it, Claude has to use `gh` CLI via Bash and guess context. With it, Claude can directly fetch PR diffs, read open issues, and post structured comments as a first-class tool.
**Setup:** Add to `.claude/settings.local.json` under `mcpServers`:
```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "ghcr.io/github/github-mcp-server"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<your-token>" }
    }
  }
}
```
**Learning:** MCP server configuration, resource/tool distinction, integrating third-party MCP servers.

---

## Experiment 2 — Cloud-Parallel PR Review via GitHub Actions
**What:** Add a new GitHub Actions workflow (`.github/workflows/ai-review.yaml`) triggered on `pull_request` that:
1. Gets the PR diff
2. Calls the Claude API with the diff + system prompt tuned to Angular/TypeScript
3. Posts the review as a PR comment using `gh pr review --comment`
**Why it matters:** This runs entirely in the cloud, in parallel, the moment you push — no human intervention. You get AI code review on every PR automatically.
**Learning:** GitHub Actions event triggers, Claude API in CI/CD context, `ANTHROPIC_API_KEY` as a GitHub secret.
**Files:** New `.github/workflows/ai-review.yaml`, a small Node.js/Python review script.

---

## Experiment 3 — Scheduled GitHub Actions for Maintenance
**What:** Add a cron-scheduled GitHub Actions workflow that runs weekly:
1. `npm audit` + `npm outdated` in both the Angular app and the file-server
2. Calls Claude API to summarize findings (what's critical vs cosmetic)
3. Creates or updates a GitHub Issue titled "Weekly Dependency Report" with the summary
**Why it matters:** Dependency drift is invisible until it hurts. This is a real "cloud agent running in parallel" — zero effort to maintain after setup.
**Learning:** GitHub Actions `schedule:` trigger, `gh issue create`, Claude API for summarization.
**Files:** New `.github/workflows/weekly-audit.yaml`.

---

## Experiment 4 — Strengthen CI Before Deploy (Low-Risk Foundation)
**What:** Update the existing `deploy.yaml` to run `npm run lint` and `npm test -- --watch=false --browsers=ChromeHeadless` before building. If tests fail, the deploy never happens.
**Why it matters:** Right now CI only builds and deploys. A broken commit can reach production. Tests and lint already pass locally (Husky enforces it), so this is low-risk to add.
**Learning:** Angular testing in CI (headless Chrome), fail-fast CI patterns.
**Files:** `.github/workflows/deploy.yaml`.

---

## Experiment 5 — CLAUDE.md at Repo Root
**What:** Run `/init` to generate a `CLAUDE.md` with project context: Angular 20 signals architecture, IndexedDB caching pattern, JWT flow for file-server, the prebuild env injection system, key data types.
**Why it matters:** The biggest gap — every Claude Code session currently starts cold. CLAUDE.md is loaded automatically into every conversation.
**Effort:** 30 minutes. Run `/init`, then edit the result.
**Seed content:** `agent-notes/FILE_SERVER_INTEGRATION_GUIDE.md` already has good architecture notes.

---

## Experiment 6 — Playwright MCP Browser Debugging Workflow
**What:** Formalize the already-started Playwright MCP workflow:
1. `npm start` → serves the app locally
2. Use `mcp__playwright__browser_navigate`, `browser_snapshot`, `browser_evaluate`, `browser_console_messages` in the conversation
3. Inspect Angular signal state from the console (`ng.getComponent(el)`)
4. Screenshot before/after changes
**Why it matters:** Already half-working (`.playwright-mcp/` exists). Document it in CLAUDE.md as the standard debug path.

---

## Experiment 7 — `/fewer-permission-prompts`
**What:** Run `/fewer-permission-prompts` to scan recent transcripts and expand the allowlist in `.claude/settings.local.json`.
**Why it matters:** Every prompt interrupts flow. One-time setup, permanent benefit.

---

## Experiment 8 — `/schedule` for Automated Local Routines
**What:** Use the `/schedule` skill to set up a recurring remote agent (e.g., weekly): run `npm run lint`, check for new Garmin TCX files to process, summarize open TODOs in the codebase.
**Why it matters:** Cloud-parallel routines that run without the IDE open. Complements the GitHub Actions experiments with local/repo-level automation.

---

## Recommended Order

| # | Experiment | Effort | Why First |
|---|-----------|--------|-----------|
| 1 | CLAUDE.md (`/init`) | 30 min | Foundation — improves all other sessions |
| 2 | `/fewer-permission-prompts` | 5 min | Instant friction reduction |
| 3 | Strengthen CI (lint + test) | 1 hour | Low-risk, high safety value |
| 4 | GitHub MCP Server | 2 hours | Unlocks GitHub-aware conversations |
| 5 | Playwright MCP workflow | 1 hour | Formalizes what's already started |
| 6 | Cloud PR review Action | 2-3 hours | First real "AI in the cloud" experiment |
| 7 | Weekly audit Action | 1-2 hours | Ongoing passive value |
| 8 | `/schedule` routines | 30 min | Once GitHub Actions are understood |

---

## Critical Files

- `.claude/settings.local.json` — hooks, permissions, MCP server config
- `.claude/custom_hook_scripts/` — Prettier and ESLint hook scripts
- `.github/workflows/deploy.yaml` — existing CI, candidate for test+lint addition
- `agent-notes/FILE_SERVER_INTEGRATION_GUIDE.md` — seed content for CLAUDE.md
- `node-servers/file-server/utils.js` — security-critical, deserves `/security-review`
- `src/data/types.ts` — key types for any Claude context document
