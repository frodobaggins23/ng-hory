import { Climb } from '../types';
import { jested01, jested02 } from '../tracks/jested';

export const climbsJested: Climb[] = [
  {
    id: 1,
    date: '2025-02-08',
    imgs: ['jested01_01.webp', 'jested01_02.webp', 'jested01_03.webp'],
    description: 'Zimní výstup, s nesmeky a hůlkami. Není moc sněhu, ale je namrzlo.',
    duration: '01:47:06',
    distance: '5.87 km',
    heartRate: '137 bpm',
    elevationGain: 757,
    track: jested01 as GeoJSON.GeoJsonObject,
  },
  {
    id: 2,
    date: '2025-04-28',
    imgs: ['jested02_01.webp', 'jested02_02.webp', 'jested02_03.webp', 'jested02_04.webp'],
    description: 'Jarní výšlap. Slunečné počasí, všude se to zelená. Ideální podmínky.',
    duration: '01:33:31',
    distance: '5.56 km',
    heartRate: '138 bpm',
    elevationGain: 742,
    track: jested02 as GeoJSON.GeoJsonObject,
  },
];
