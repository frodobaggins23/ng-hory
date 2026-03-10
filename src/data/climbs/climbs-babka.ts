import { Climb } from '../types';

export const climbsBabka: Climb[] = [
  {
    id: 1,
    date: '2025-12-20',
    imgs: [
      'babka01_01.webp',
      'babka01_02.webp',
      'babka01_03.webp',
      'babka01_04.webp',
      'babka01_05.webp',
    ],
    description: 'Výstup na Babku v rámci výletu po okolí Skalky. Bylo úžasné mlhavé počasí.',
    duration: 2874, // 0:47:54
    distance: 2960,
    heartRate: 123,
    elevationGain: 282,
    trackPath: './assets/tracks/babka/babka01.json',
  },
  {
    id: 2,
    date: '2026-03-02',
    description:
      'Vzal jsem si volno a jel se projít do Brd. Tentokrát jsem se po výšlapu na Babku vracel novou trasou po modré do Dobřichovic. Počasí bylo parádní.',
    duration: 3589, //0:59:49
    distance: 3590,
    heartRate: 125,
    elevationGain: 305,
    trackPath: './assets/tracks/babka/babka02.json',
  },
];
