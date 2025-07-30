import { Climb } from '../types';
import { jested01, jested02 } from '../tracks/jested';

export const climbsJested: Climb[] = [
  {
    id: 1,
    date: '2025-02-08',
    imgs: ['jested01_01.jpg', 'jested01_02.jpg', 'jested01_03.jpg'],
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
    imgs: ['jested02_01.jpg', 'jested02_02.jpg', 'jested02_03.jpg', 'jested02_04.jpg'],
    description: 'Jarní výšlap. Slunečné počasí, všude se to zelená. Ideální podmínky.',
    duration: '01:33:31',
    distance: '5.56 km',
    heartRate: '138 bpm',
    elevationGain: 742,
    track: jested02 as GeoJSON.GeoJsonObject,
  },
];
