import * as fs from 'fs';
import * as path from 'path';
import type { Climb } from '../src/data/types';
import { durationToSeconds } from '../src/app/utils/duration.utils';

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function normalizeDurationString(duration: string): string {
  const parts = duration.split(':').map(part => part.trim());
  while (parts.length < 3) {
    parts.unshift('0');
  }
  return parts.join(':');
}

function parseActivityCsv(
  csvPath: string,
  id: number,
  date: string,
  description: string,
  parseLineNumber?: number
): Climb {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');

  if (lines.length < 2) {
    throw new Error('CSV file must contain at least header and summary line');
  }

  const header = parseCsvLine(lines[0]);
  const summaryLine = lines[lines.length - 1];

  const dataLine = parseLineNumber
    ? parseCsvLine(lines[parseLineNumber])
    : parseCsvLine(summaryLine);

  const data: Record<string, string> = {};
  header.forEach((key, index) => {
    data[key] = dataLine[index] || '';
  });

  const normalizedDuration = normalizeDurationString(data['Čas'] || '0:00:00');

  console.info('Duration in Human Readbable Format:', normalizedDuration);
  console.info('Copy data below to climb data file');
  console.info('-----------------------------');

  const climb: Climb = {
    id,
    date,
    description,
    duration: durationToSeconds(normalizedDuration),
    distance: parseFloat(data['Vzdálenost'] || '0') * 1000,
    heartRate: parseInt(data['Průměrný ST'] || '0', 10),
    elevationGain: parseInt(data['Výstup'] || '0', 10),
  };

  return climb;
}

function isValidDate(dstring: string): boolean {
  const isYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/.test(dstring);
  if (!isYYYYMMDD) return false;

  const dateObj = new Date(dstring);
  const isValidDateString = !Number.isNaN(dateObj.getTime());

  return isValidDateString;
}

function getIdFromFilename(filename: string): number | null {
  const idMatch = filename.match(/(\d+)$/);
  return idMatch ? parseInt(idMatch[1]) : null;
}

function getParamsFromCsvFilename(csvFile: string) {
  const fileName = path.basename(csvFile, path.extname(csvFile));
  const [mountainWithId, dateString] = fileName.split('_');

  const id = getIdFromFilename(mountainWithId);
  const date = isValidDate(dateString) ? dateString : null;

  return { id, date };
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Declare source file');
    console.error('Usage: tsx prepare-climb.ts <csv-file> <description?> <parse-line-number?>');
    console.error(
      'Example: tsx prepare-climb.ts activities_data/jested03_2025_02_01.csv "Winter climb" 2'
    );
    process.exit(1);
  }

  const [csvFile, description, parseLineNumberStr] = args;
  const parseLineNumber = parseLineNumberStr ? parseInt(parseLineNumberStr, 10) : undefined;

  const { id, date } = getParamsFromCsvFilename(csvFile);

  const idWithFallback = id ?? 0;
  const dateWithFallback = date ?? '***provide date**';
  const descriptionWithFallback = description ?? '***provide description**';

  const csvPath = path.resolve(process.cwd(), csvFile);

  if (!fs.existsSync(csvPath)) {
    console.error(`Error: File not found: ${csvPath}`);
    process.exit(1);
  }

  try {
    const climb = parseActivityCsv(
      csvPath,
      idWithFallback,
      dateWithFallback,
      descriptionWithFallback,
      parseLineNumber
    );
    console.log(JSON.stringify(climb, null, 2));
  } catch (error) {
    console.error('Error parsing CSV:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
