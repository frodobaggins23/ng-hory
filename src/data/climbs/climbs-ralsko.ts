import { ralsko01, ralsko02, ralsko03, ralsko04 } from '../tracks/ralsko';
import { Climb } from '../types';

export const climbsRalsko: Climb[] = [
  {
    id: 1,
    date: '2025-02-15',
    imgs: [
      'ralsko01_01.webp',
      'ralsko01_02.webp',
      'ralsko01_03.webp',
      'ralsko01_04.webp',
      'ralsko01_05.webp',
    ],
    description: 'Zimní výstup na Ralsko. Sníh a led na vrcholu, ale výhledy stojí za to.',
    duration: '01:36:03',
    distance: '4.66 km',
    heartRate: '131 bpm',
    elevationGain: 542,
    track: ralsko01 as GeoJSON.GeoJsonObject,
  },
  {
    id: 2,
    date: '2025-04-19',
    imgs: ['ralsko02_01.webp', 'ralsko02_02.webp', 'ralsko02_03.webp'],
    description: 'Jarní výstup na Ralsko. Květy a zelené listí, ideální podmínky.',
    duration: '01:30:37',
    distance: '5.37 km',
    heartRate: '125 bpm',
    elevationGain: 538,
    track: ralsko02 as GeoJSON.GeoJsonObject,
  },
  {
    id: 3,
    date: '2025-07-23',
    imgs: [],
    description: 'Letni výšlap známou trasou z Mimoně. Zpět novou cestou podél Ploučnice.',
    duration: '01:15:54',
    distance: '4.51km',
    heartRate: '126 bpm',
    elevationGain: 408,
    track: ralsko03 as GeoJSON.GeoJsonObject,
  },
  {
    id: 4,
    date: '2025-10-25',
    imgs: [],
    description:
      'Podzimní výstup na Ralsko. Barevné listí a klidná atmosféra. Stejná trasa jako v dubnu.',
    duration: '01:11:50',
    distance: '4.58km',
    heartRate: '130 bpm',
    elevationGain: 419,
    track: ralsko04 as GeoJSON.GeoJsonObject,
  },
];
