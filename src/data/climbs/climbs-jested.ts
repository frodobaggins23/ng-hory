import { Climb } from '../types';

export const climbsJested: Climb[] = [
  {
    id: 1,
    date: '2025-02-08',
    imgs: ['jested01_01.webp', 'jested01_02.webp', 'jested01_03.webp'],
    description: 'Zimní výstup, s nesmeky a hůlkami. Není moc sněhu, ale je namrzlo.',
    duration: 6426, // 01:47:06,
    distance: 5870,
    heartRate: 137,
    elevationGain: 757,
    trackPath: './assets/tracks/jested/jested01.json',
  },
  {
    id: 2,
    date: '2025-04-28',
    imgs: ['jested02_01.webp', 'jested02_02.webp', 'jested02_03.webp', 'jested02_04.webp'],
    description: 'Jarní výšlap. Slunečné počasí, všude se to zelená. Ideální podmínky.',
    duration: 5611, // 01:33:31,
    distance: 5560,
    heartRate: 138,
    elevationGain: 742,
    trackPath: './assets/tracks/jested/jested02.json',
  },
  {
    id: 3,
    date: '2025-11-23',
    imgs: [
      'jested03_01.webp',
      'jested03_02.webp',
      'jested03_03.webp',
      'jested03_04.webp',
      'jested03_05.webp',
      'jested03_06.webp',
    ],
    description:
      'Spíš výlet, než klasický výstup. Procházka po hřebeni se zastávkou na krásné výhlídce Červený kámen',
    duration: 16979,
    distance: 17710,
    heartRate: 126,
    elevationGain: 757,
    trackPath: './assets/tracks/jested/jested03.json',
  },
];
