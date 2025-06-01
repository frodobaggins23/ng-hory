import { lipskaHora01 } from '../tracks/lipska_hora';
import { Climb } from '../types';

export const climbsLipskaHora: Climb[] = [
  {
    id: 1,
    date: '2025-05-24',
    img: '/img/lipska_hora.jpg',
    description:
      'Prvovýstup na vrchol Lipské hory. Vyhlídka nahoře byla úchvatná. Když jsem tam dorazil, spontálně jsem udělal wow.',
    duration: '0:39:03',
    distance: '2.03 km',
    heartRate: '147 bpm',
    elevationGain: 321,
    track: lipskaHora01 as GeoJSON.GeoJsonObject,
  },
];
