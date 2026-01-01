import { Climb } from '../types';
import { rip03, rip02 } from '../tracks/rip/';

export const climbsRip: Climb[] = [
  {
    id: 1,
    date: '2025-01-03',
    imgs: ['rip01_01.webp', 'rip01_02.webp', 'rip01_03.webp'],
    description: 'Úplně první výšlap tohoto projektu! Byla zima a brutalně to klouzalo.',
    duration: 1774, // 0:29:34,
    distance: 2100,
    heartRate: 133,
    elevationGain: 203,
  },
  {
    id: 2,
    date: '2025-06-22',
    imgs: ['rip02_01.webp', 'rip02_02.webp'],
    description: 'Letní výšlap na Říp. Cestou za babičkou.',
    duration: 1816, // 0:30:16,
    distance: 2180,
    heartRate: 136,
    elevationGain: 203,
    track: rip02 as GeoJSON.GeoJsonObject,
  },
  {
    id: 3,
    date: '2025-12-29',
    imgs: ['rip03_01.webp', 'rip03_02.webp', 'rip03_03.webp', 'rip03_04.webp'],
    description:
      'Opět cestou za babičkou. Tentokrát s tátou. Pohodové tempo. Poslední výšlap v roce 2025.',
    duration: 2513, // 0:41:53,
    distance: 2230,
    heartRate: 112,
    elevationGain: 216,
    track: rip03 as GeoJSON.GeoJsonObject,
  },
];
