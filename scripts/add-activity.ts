import 'dotenv/config';
import { mkdir, readdir, rm } from 'fs/promises';
import path from 'path';
import { createInterface, type Interface } from 'readline/promises';
import { mountains } from '../src/data';
import type { Climb, Mountain } from '../src/data/types';
import { isTcxFile, parseActivityFile } from './lib/activity-parser';
import { compressAndRenamePhotos } from './lib/image-processor';
import { uploadImagesToFileServer } from './lib/file-server-client';
import { appendClimbToFile, writeTrackGeoJSON } from './lib/climb-writer';
import {
  assertCleanWorkingTree,
  commitFiles,
  createBranch,
  openDraftPullRequest,
  pushBranch,
} from './lib/git-publish';

// Assumes invocation from the repo root, same as the rest of the npm scripts.
const REPO_ROOT = process.cwd();
const WATCH_DIR = path.join(REPO_ROOT, '.activity-tmp');
const TRACKS_ROOT = path.join(REPO_ROOT, 'public/assets/tracks');
const CLIMBS_DIR = path.join(REPO_ROOT, 'src/data/climbs');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg']);

interface AddedClimb {
  mountain: Mountain;
  climb: Climb;
  climbsFilePath: string;
  trackFilePath: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Set it in your local .env file.`
    );
  }
  return value;
}

function climbsFilePathFor(imgFolder: string): string {
  return path.join(CLIMBS_DIR, `climbs-${imgFolder.replace(/_/g, '-')}.ts`);
}

async function findFile(dir: string, predicate: (filename: string) => boolean): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter(entry => entry.isFile() && predicate(entry.name)).map(entry => entry.name);
}

async function processMountainFolder(
  slug: string,
  folderPath: string,
  mountain: Mountain,
  rl: Interface,
  fileServerHost: string,
  fileServerAdminToken: string
): Promise<AddedClimb> {
  const tcxFiles = await findFile(folderPath, isTcxFile);
  if (tcxFiles.length !== 1) {
    throw new Error(
      `Expected exactly one .tcx file in ${folderPath}, found ${tcxFiles.length}: [${tcxFiles.join(', ')}]`
    );
  }

  const photoFiles = (
    await findFile(folderPath, name => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
  ).sort();

  if (photoFiles.length === 0) {
    throw new Error(`No .jpg/.jpeg photos found in ${folderPath}`);
  }

  const parsed = await parseActivityFile(path.join(folderPath, tcxFiles[0]));

  const nextId = (mountain.climbs?.at(-1)?.id ?? 0) + 1;
  const idPadded = String(nextId).padStart(2, '0');
  const namePrefix = `${slug}${idPadded}`;

  const description = await rl.question(
    `Description for ${mountain.name} climb #${nextId} (${parsed.date}): `
  );

  console.log(`Compressing ${photoFiles.length} photo(s)...`);
  const compressedDir = path.join(folderPath, '.compressed');
  const compressed = await compressAndRenamePhotos(
    photoFiles.map(name => path.join(folderPath, name)),
    compressedDir,
    namePrefix
  );

  console.log(`Uploading ${compressed.length} photo(s) to the file server...`);
  await uploadImagesToFileServer(fileServerHost, fileServerAdminToken, slug, compressed);

  const trackFilePath = path.join(TRACKS_ROOT, slug, `${namePrefix}.json`);
  const climb: Climb = {
    id: nextId,
    date: parsed.date,
    imgs: compressed.map(file => file.filename),
    description: description.trim() || '(no description provided)',
    duration: parsed.duration,
    distance: parsed.distance,
    heartRate: parsed.heartRate,
    elevationGain: parsed.elevationGain,
    trackPath: `./assets/tracks/${slug}/${namePrefix}.json`,
  };

  await writeTrackGeoJSON(trackFilePath, parsed.geoJSON);

  const climbsFilePath = climbsFilePathFor(slug);
  await appendClimbToFile(climbsFilePath, climb);

  return { mountain, climb, climbsFilePath, trackFilePath };
}

function buildCommitMessage(added: AddedClimb[]): string {
  if (added.length === 1) {
    const { mountain, climb } = added[0];
    return `feat: Add climb #${climb.id} to ${mountain.name}`;
  }
  return `feat: Add ${added.length} new climbs`;
}

function buildBranchName(added: AddedClimb[]): string {
  if (added.length === 1) {
    const { mountain, climb } = added[0];
    return `activity/${mountain.imgFolder}-${String(climb.id).padStart(2, '0')}`;
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `activity/batch-${timestamp}`;
}

function buildPrBody(added: AddedClimb[]): string {
  const lines = added.map(
    ({ mountain, climb }) =>
      `- **${mountain.name}** #${climb.id} (${climb.date}) - ${climb.distance}m, ` +
      `+${climb.elevationGain}m elevation, ${climb.imgs?.length ?? 0} photo(s)`
  );
  return `Added via the \`add-activity\` wizard:\n\n${lines.join('\n')}`;
}

async function main() {
  const fileServerHost = requireEnv('FILE_SERVER_HOST');
  const fileServerAdminToken = requireEnv('FILE_SERVER_ADMIN_TOKEN');
  const githubToken = requireEnv('GITHUB_TOKEN');

  assertCleanWorkingTree();

  await mkdir(WATCH_DIR, { recursive: true });

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  const validSlugs = mountains.map(m => m.imgFolder).join(', ');
  await rl.question(
    `Drop the .tcx and photos for each activity into .activity-tmp/<mountain-slug>/\n` +
      `Valid mountain slugs: ${validSlugs}\n` +
      `Press Enter when everything is in place...`
  );

  const entries = await readdir(WATCH_DIR, { withFileTypes: true });
  const candidateSlugs = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);

  const added: AddedClimb[] = [];
  const processedFolders: string[] = [];

  for (const slug of candidateSlugs) {
    const folderPath = path.join(WATCH_DIR, slug);
    const files = await readdir(folderPath, { withFileTypes: true });
    if (files.length === 0) continue;

    const mountain = mountains.find(m => m.imgFolder === slug);
    if (!mountain) {
      console.error(
        `Skipping "${slug}": no mountain with imgFolder "${slug}". Valid slugs: ${validSlugs}`
      );
      continue;
    }

    try {
      const result = await processMountainFolder(
        slug,
        folderPath,
        mountain,
        rl,
        fileServerHost,
        fileServerAdminToken
      );
      added.push(result);
      processedFolders.push(folderPath);
    } catch (error) {
      console.error(`Failed to process ${folderPath}:`, (error as Error).message);
      console.error('Leaving this folder in place so you can fix it and re-run.');
    }
  }

  rl.close();

  if (added.length === 0) {
    console.log('No climbs were added.');
    return;
  }

  const filesToCommit = added.flatMap(a => [a.climbsFilePath, a.trackFilePath]);
  const branchName = buildBranchName(added);
  const commitMessage = buildCommitMessage(added);

  console.log(`Creating branch ${branchName} and committing ${filesToCommit.length} file(s)...`);
  createBranch(branchName);
  commitFiles(filesToCommit, commitMessage);
  pushBranch(branchName);

  console.log('Opening draft pull request...');
  const prUrl = await openDraftPullRequest(
    githubToken,
    branchName,
    commitMessage,
    buildPrBody(added)
  );

  for (const folderPath of processedFolders) {
    await rm(folderPath, { recursive: true, force: true });
  }

  console.log(`\nDone. ${added.length} climb(s) added: ${prUrl}`);
  console.log(
    'Deploy is still manual - run the "Deploy website" workflow when you are ready to go live.'
  );
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
