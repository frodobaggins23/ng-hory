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

## 🛠️ Asset helper scripts

The project includes several helper scripts for preparing assets. Each script has specific prerequisites:

- `npm run prepare:tracks`
	- Requires `.tracks-tmp` folder with GPX files to be present in the project root.

- `npm run prepare:climb`
	- Needs a Garmin activity export in CSV format as input.

- `npm run prepare:images`
	- Requires ImageMagick binary at `~/Apps/magick/magick` (download and install if missing).
	- Needs `.images-tmp` folder in the project root with `.jpg` images to process.
	- Will create `.images-tmp/compressed` if it does not exist.


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

