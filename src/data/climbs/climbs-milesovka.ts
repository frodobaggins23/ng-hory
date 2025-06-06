import { milesovka01, milesovka02 } from '../tracks/milesovka';
import { Climb } from '../types';

export const climbsMilesovka: Climb[] = [
  {
    id: 1,
    date: '2025-01-25',
    imgs: ['/img/milesovka.jpg'],
    description:
      'Zimní výstup. Nebylo ani tolik sněhu, ale na vrcholu byl led. Bez nesmeků to nešlo.',
    duration: '01:33:01',
    distance: '4.55 km',
    heartRate: '137 bpm',
    elevationGain: 701,
    track: milesovka01 as GeoJSON.GeoJsonObject,
  },
  {
    id: 2,
    date: '2025-05-11 ',
    imgs: [],
    description:
      'Krásný jarní výstup. Slunečné počasí, všude se to zelená. Ideální podmínky.',
    duration: '01:17:33',
    distance: '4.31 km',
    heartRate: '126 bpm',
    elevationGain: 639,
    track: milesovka02 as GeoJSON.GeoJsonObject,
  },
];
