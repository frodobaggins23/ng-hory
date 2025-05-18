import { Climb } from '../types';
import { lovos01 } from '../tracks/lovos';

export const climbsLovos: Climb[] = [
  {
    id: 1,
    date: '2025-01-12',
    img: '/img/lovos.jpg',
    description:
      'Zimní výstup na Lovoš. Bez nesmeků to nešlo. Sníh a led na vrcholu.',
    duration: '01:38:17',
    distance: '5.18 km',
    heartRate: '124 bpm',
    track: lovos01 as GeoJSON.GeoJsonObject,
  },
];
