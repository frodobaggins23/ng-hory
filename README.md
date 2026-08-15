# 🏔️ Moje Hory

This is a hobby project I created to track my passion - hiking to mountains accross the Czech republic. It is focused on presentation of my fitness data as well as on preserving memories through attached photogalleries.

In the same time, this is my first project in Angular, created heavily with assistance of various LLMs, most notably Claude Code.

## 💻 Local development

### 1. Define environment variables

Create `src/environments/environment.development.ts` and populate it with secrets.

This file is used by dev server using file replacements. DO NOT place any secrets to src/environments/environment.ts, as this is is placeholder file used in CI pipelines.

### 2. Start local development

To start a local development server, run:

```bash
npm run start
```

App is running on http://localhost:4200 by default

## 🚀 Building app

To build the app , first make sure that you have .env file in your root with all necessary secrets for the `prebuild` script. 

Then run
```bash
npm run build
```

## 🖥️ Node servers

App related node servers are located in ./node-servers.

Each server has its dedicated dependencies and CI/CD process. 

## 🥾 Adding a new activity

`npm run add-activity` walks through adding a climb end to end: parsing the
Garmin `.tcx`, compressing and renaming photos, uploading them to the file
server, writing the `Climb` entry and its GeoJSON track, and opening a draft
PR. Prerequisites:

- ImageMagick binary at `~/Apps/magick/magick` (download and install if missing).
- A local `.env` (gitignored) with:
  - `FILE_SERVER_HOST` - same value used for the app build.
  - `FILE_SERVER_ADMIN_TOKEN` - must match `ADMIN_TOKEN` configured on the file server (see [node-servers/file-server/README.md](node-servers/file-server/README.md)). This is a separate secret from the gallery passphrase.
  - `GITHUB_TOKEN` - a fine-grained GitHub PAT scoped to this repo only, with contents + pull request write access.

To use it:

1. Run `npm run add-activity`.
2. When prompted, drop the activity's `.tcx` file and its `.jpg`/`.jpeg`
   photos into `.activity-tmp/<mountain-slug>/` (slugs are each mountain's
   `imgFolder`, e.g. `jested`, `lipska_hora` - the prompt lists all of them).
3. Press Enter. The wizard parses the track, compresses and sequentially
   renames the photos, uploads them, asks for a one-line description, then
   writes and commits the data changes, pushes a branch, and opens a draft
   PR for you to review.
4. Publishing to the live site is still a separate, manual step: merge the
   PR, then run the "Deploy website" GitHub Actions workflow.


## 🅰️ Angular CLI

Use Angular CLI powerful code scaffolding tools.

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

To build the project run:

```bash
ng build
```

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

