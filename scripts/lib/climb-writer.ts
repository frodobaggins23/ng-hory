import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import * as prettier from 'prettier';
import type { Climb } from '../../src/data/types';

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatClimbEntry(climb: Climb): string {
  const imgsList = (climb.imgs ?? []).map(img => `'${img}'`).join(', ');

  return `{
    id: ${climb.id},
    date: '${climb.date}',
    imgs: [${imgsList}],
    description: ${JSON.stringify(climb.description)},
    duration: ${climb.duration}, // ${formatDuration(climb.duration)}
    distance: ${climb.distance},
    heartRate: ${climb.heartRate},
    elevationGain: ${climb.elevationGain},
    trackPath: '${climb.trackPath}',
  }`;
}

async function formatWithProjectConfig(source: string, filepath: string): Promise<string> {
  const config = (await prettier.resolveConfig(filepath)) ?? {};
  return prettier.format(source, { ...config, filepath });
}

/**
 * Appends a new Climb object literal to the end of a `climbs-<mountain>.ts` array
 * and re-formats the file with prettier so the result matches the project's style.
 */
export async function appendClimbToFile(climbsFilePath: string, climb: Climb): Promise<void> {
  const content = await readFile(climbsFilePath, 'utf-8');
  const closingIndex = content.lastIndexOf('];');

  if (closingIndex === -1) {
    throw new Error(`Could not find a "];" array terminator in ${climbsFilePath}`);
  }

  const entry = formatClimbEntry(climb);
  const updated = `${content.slice(0, closingIndex)}  ${entry},\n${content.slice(closingIndex)}`;

  const formatted = await formatWithProjectConfig(updated, climbsFilePath);
  await writeFile(climbsFilePath, formatted, 'utf-8');
}

/**
 * Writes the lap GeoJSON for a climb into public/assets/tracks/<slug>/, formatted with prettier.
 */
export async function writeTrackGeoJSON(trackFilePath: string, geoJSON: unknown): Promise<void> {
  await mkdir(path.dirname(trackFilePath), { recursive: true });
  const formatted = await formatWithProjectConfig(JSON.stringify(geoJSON), trackFilePath);
  await writeFile(trackFilePath, formatted, 'utf-8');
}
