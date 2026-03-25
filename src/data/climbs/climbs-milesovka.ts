import { Climb } from '../types';

export const climbsMilesovka: Climb[] = [
  {
    id: 1,
    date: '2025-01-25',
    imgs: ['milesovka01_01.webp'],
    description:
      'Zimní výstup. Nebylo ani tolik sněhu, ale na vrcholu byl led. Bez nesmeků to nešlo.',
    duration: 5581, // 01:33:01,
    distance: 4550,
    heartRate: 137,
    elevationGain: 523,
    trackPath: './assets/tracks/milesovka/milesovka01.json',
  },
  {
    id: 2,
    date: '2025-05-11 ',
    imgs: [
      'milesovka02_01.webp',
      'milesovka02_02.webp',
      'milesovka02_03.webp',
      'milesovka02_04.webp',
      'milesovka02_05.webp',
    ],
    description: 'Krásný jarní výstup. Slunečné počasí, všude se to zelená. Ideální podmínky.',
    duration: 4653, // 01:17:33,
    distance: 4310,
    heartRate: 126,
    elevationGain: 520,
    trackPath: './assets/tracks/milesovka/milesovka02.json',
  },
  {
    id: 3,
    date: '2025-10-11 ',
    imgs: ['milesovka03_01.webp'],
    description:
      'Podzimní výstup na Milešovku. Barevné listí a klidná atmosféra. Stejná trasa jako v květnu.',
    duration: 4964, // 01:22:44,
    distance: 4660,
    heartRate: 129,
    elevationGain: 525,
    trackPath: './assets/tracks/milesovka/milesovka02.json',
  },
];
