import { Climb } from '../types';
import { lovos01 } from '../tracks/lovos';

export const climbsLovos: Climb[] = [
  {
    id: 1,
    date: '2025-01-12',
    imgs: [
      'lovos01_01.webp',
      'lovos01_02.webp',
      'lovos01_03.webp',
      'lovos01_04.webp',
      'lovos01_05.webp',
      'lovos01_06.webp',
    ],
    description: 'Zimní výstup na Lovoš. Bez nesmeků to nešlo. Sníh a led na vrcholu.',
    duration: '01:38:17',
    distance: '5.18 km',
    heartRate: '124 bpm',
    elevationGain: 633,
    track: lovos01 as GeoJSON.GeoJsonObject,
  },
];
