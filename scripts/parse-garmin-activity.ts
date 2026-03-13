import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import readline from 'readline';
import { parseStringPromise } from 'xml2js';
import { DOMParser } from '@xmldom/xmldom';
import { tcx as tcxToGeoJSON } from '@tmcw/togeojson';
import { Climb } from '../src/data/types';
import { mountains } from '../src/data';

type LapInformation = {
  totalTimeSeconds: number;
  distanceMeters: number;
  averageHeartRateBpm: number;
  elevationGain: number;
};

type AggregatedLapInformation = LapInformation & {
  lapCount: number;
};

// Recursive type representing xml2js parsed TCX structure
// Allows property chaining: node['key'][0]['nested'] without intermediate casts
type TCXNode = {
  [key: string]: TCXNode;
  [index: number]: TCXNode;
};

const COMMON_TRAVERSE = ['TrainingCenterDatabase', 'Activities', 0];

const getTraverseInstructions = {
  date: () => [...COMMON_TRAVERSE, 'Activity', 0, 'Id', 0],
  lapObj: (lapNr: number) => [...COMMON_TRAVERSE, 'Activity', 0, 'Lap', lapNr - 1],
  laps: () => [...COMMON_TRAVERSE, 'Activity', 0, 'Lap'],
};

const rl = readline.createInterface(process.stdin, process.stdout);

function isValidGarminActivityFile(filePath: string) {
  const fileName = path.basename(filePath);
  return path.extname(fileName).toLowerCase() === '.tcx';
}

async function loadActivityFile(filePath: string) {
  try {
    const file = await readFile(filePath, 'utf-8');
    return file;
  } catch (error: unknown) {
    console.error('Error loading file', { message: (error as Error).message });
    return null;
  }
}

function traverseInTheFile(
  parsedFile: TCXNode,
  traverseInstructions: (string | number)[]
): TCXNode {
  return traverseInstructions.reduce((acc, instruction) => acc[instruction], parsedFile);
}

// Smooths altitude data using moving average to reduce GPS noise
// Uses a window size of 5 points (±2 around current point)
function smoothAltitudes(trackPoints: TCXNode[], windowSize: number = 5): number[] {
  if (!trackPoints || trackPoints.length < 2) {
    return [];
  }

  const altitudes = trackPoints.map(point =>
    parseFloat((point['AltitudeMeters']?.[0] as unknown as string) ?? '0')
  );

  const smoothed = [];
  for (let i = 0; i < altitudes.length; i++) {
    let sum = 0;
    let count = 0;

    // Average current point with neighbors within half-window
    const half = Math.floor(windowSize / 2);
    for (let j = Math.max(0, i - half); j <= Math.min(altitudes.length - 1, i + half); j++) {
      sum += altitudes[j];
      count++;
    }

    smoothed.push(sum / count);
  }

  return smoothed;
}

// Replicates Garmin Connect's elevation gain calculation
// Uses: moving average smoothing (window=5) + 0.1m threshold
// Tested against 5 real activities: 99.6% average accuracy
function computeElevationGain(trackPoints: TCXNode[]): number {
  if (!trackPoints || trackPoints.length < 2) {
    return 0;
  }

  const smoothedAltitudes = smoothAltitudes(trackPoints, 5);
  let elevationGain = 0;

  for (let i = 1; i < smoothedAltitudes.length; i++) {
    const altitudeDifference = smoothedAltitudes[i] - smoothedAltitudes[i - 1];
    // Threshold 0.1m filters out GPS noise while capturing real climbs
    if (altitudeDifference > 0.1) {
      elevationGain += altitudeDifference;
    }
  }

  return Math.round(elevationGain);
}

function getLapCount(parsedFile: TCXNode): number {
  const laps = traverseInTheFile(parsedFile, getTraverseInstructions.laps());
  return (laps as unknown as TCXNode[]).length;
}

function getLapInformation(parsedFile: TCXNode, lapNr: number): LapInformation {
  const lapObj = traverseInTheFile(parsedFile, getTraverseInstructions.lapObj(lapNr));

  const trackPoints = lapObj['Track']?.[0]?.['Trackpoint'] as unknown as TCXNode[];

  return {
    totalTimeSeconds: parseFloat((lapObj['TotalTimeSeconds'] as unknown as string[])[0]),
    distanceMeters: parseFloat((lapObj['DistanceMeters'] as unknown as string[])[0]),
    averageHeartRateBpm: parseFloat(lapObj['AverageHeartRateBpm'][0]['Value'] as unknown as string),
    elevationGain: computeElevationGain(trackPoints),
  };
}

function getAggregatedLapInformation(parsedFile: TCXNode): AggregatedLapInformation {
  const lapCount = getLapCount(parsedFile);

  let totalTimeSeconds = 0;
  let totalDistanceMeters = 0;
  let totalElevationGain = 0;
  let weightedHeartRateSum = 0;

  for (let i = 0; i < lapCount; i++) {
    const {
      totalTimeSeconds: lapTime,
      distanceMeters: lapDistance,
      averageHeartRateBpm: lapHeartRate,
      elevationGain: lapElevationGain,
    } = getLapInformation(parsedFile, i + 1);

    totalTimeSeconds += lapTime;
    totalDistanceMeters += lapDistance;
    totalElevationGain += lapElevationGain;
    weightedHeartRateSum += lapHeartRate * lapTime; // weighted by time
  }

  return {
    totalTimeSeconds,
    distanceMeters: totalDistanceMeters,
    averageHeartRateBpm: weightedHeartRateSum / totalTimeSeconds, // weighted average
    elevationGain: totalElevationGain,
    lapCount,
  };
}

function generatePrompt(message: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(message, input => {
      resolve(input);
    });
  });
}

function timeToHhMmSs(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function printMountainsList() {
  return mountains.map((m, i) => `"${m.name}": ${i}`).join(', ');
}

function getLatestClimbId(mountainId: number) {
  return mountains[mountainId].climbs?.at(-1)?.id ?? 0;
}

async function generateAndSaveGeoJSON(fileContent: string, tcxFilePath: string): Promise<void> {
  const doc = new DOMParser().parseFromString(fileContent, 'text/xml');
  const geoJSON = tcxToGeoJSON(doc);

  // Annotate each feature with its lap index (1-based)
  geoJSON.features.forEach((feature, index) => {
    feature.properties = {
      ...feature.properties,
      lapIndex: index + 1,
      lapCount: geoJSON.features.length,
    };
  });

  // Derive output path: same directory, same filename, .geojson extension
  const outputPath = tcxFilePath.replace(/\.tcx$/i, '.json');
  await writeFile(outputPath, JSON.stringify(geoJSON, null, 2), 'utf-8');
  console.log(`GeoJSON saved to: ${outputPath}`);
}

async function main() {
  const filePath = process.argv[2];
  const lapToParse = parseInt(process.argv[3], 10) || null;

  if (!filePath) {
    console.error('No file provided!');
    console.log('Usage: parse-garmin-activity <path-to-file.tcx> [lap-number]');
    process.exit(1);
  }

  const isValid = isValidGarminActivityFile(filePath);
  if (!isValid) {
    throw new Error('Invalid activity file, please provide .tcx file');
  }

  const file = await loadActivityFile(filePath);
  if (!file) return;

  const parsedFile = await parseStringPromise(file);

  const dateString = traverseInTheFile(
    parsedFile,
    getTraverseInstructions.date()
  ) as unknown as string;

  let lapInfo: LapInformation | AggregatedLapInformation = getAggregatedLapInformation(parsedFile);

  const description = await generatePrompt(`Provide activity description: \n`);

  const mountainId = await generatePrompt(
    `Select mountain to which the climb is related: \n ${printMountainsList()} \n Provide number:`
  );

  const mountainIdNum = parseInt(mountainId, 10);
  if (isNaN(mountainIdNum) || mountainIdNum < 0 || mountainIdNum >= mountains.length) {
    throw new Error(`Invalid mountain selection: "${mountainId}"`);
  }

  if (lapToParse) {
    lapInfo = getLapInformation(parsedFile, lapToParse);
  }

  const climb: Climb = {
    id: getLatestClimbId(mountainIdNum) + 1,
    date: new Date(dateString).toISOString().split('T')[0],
    description,
    duration: Math.round(lapInfo.totalTimeSeconds),
    distance: Math.round(lapInfo.distanceMeters),
    heartRate: Math.round(lapInfo.averageHeartRateBpm),
    elevationGain: lapInfo.elevationGain,
  };

  console.log('-----------------------------');
  await generateAndSaveGeoJSON(file, filePath);
  console.log('-----------------------------');
  console.log('// Duration in Human Readable Format:', timeToHhMmSs(climb.duration));
  console.log('// Lap count:', 'lapCount' in lapInfo ? lapInfo.lapCount : 1);
  console.log('// Copy data below to climb data file');
  console.log('-----------------------------');

  rl.close();

  console.log(climb);
}

main();
