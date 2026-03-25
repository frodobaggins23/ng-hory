import { Climb } from '../types';

export const climbsLipskaHora: Climb[] = [
  {
    id: 1,
    date: '2025-05-24',
    imgs: [
      'lipska_hora01_01.webp',
      'lipska_hora01_02.webp',
      'lipska_hora01_03.webp',
      'lipska_hora01_04.webp',
    ],
    description:
      'Prvovýstup na vrchol Lipské hory. Vyhlídka nahoře byla úchvatná. Když jsem tam dorazil, spontálně jsem udělal wow.',
    duration: 2343, // 0:39:03,
    distance: 2030,
    heartRate: 147,
    elevationGain: 295,
    trackPath: './assets/tracks/lipska_hora/lipska_hora01.json',
  },
  {
    id: 2,
    date: '2026-03-07',
    description: 'Jarní rychlovýšlap. Bohužel byl opar, takže výhledy nic moc.',
    duration: 2271, // 0:37:51
    distance: 2090,
    heartRate: 153,
    elevationGain: 297,
    trackPath: './assets/tracks/lipska_hora/lipska_hora02.json',
  },
];
