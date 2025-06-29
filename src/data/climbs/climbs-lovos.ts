import { Climb } from '../types';
import { lovos01 } from '../tracks/lovos';

export const climbsLovos: Climb[] = [
  {
    id: 1,
    date: '2025-01-12',
    imgs: ['lovos01_01.jpg', 'lovos01_02.jpg', 'lovos01_03.jpg', 'lovos01_04.jpg', 'lovos01_05.jpg', 'lovos01_06.jpg'],
    description:
      'Zimní výstup na Lovoš. Bez nesmeků to nešlo. Sníh a led na vrcholu.',
    duration: '01:38:17',
    distance: '5.18 km',
    heartRate: '124 bpm',
    elevationGain: 633,
    track: lovos01 as GeoJSON.GeoJsonObject,
  },
];
