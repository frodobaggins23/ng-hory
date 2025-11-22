import { kostalov01 } from '../tracks/kostalov';
import { Climb } from '../types';

export const climbsKostalov: Climb[] = [
  {
    id: 1,
    date: '2025-05-24',
    imgs: [
      'kostalov01_01.webp',
      'kostalov01_02.webp',
      'kostalov01_03.webp',
      'kostalov01_04.webp',
      'kostalov01_05.webp',
    ],
    description:
      'Prvovýstup na zříceninu hradu. Vybrána trasa s největším převýšením. Krásné výhledy na okolní krajinu.',
    duration: '0:37:59',
    distance: '2.41 km',
    heartRate: '130 bpm',
    elevationGain: 298,
    track: kostalov01 as GeoJSON.GeoJsonObject,
  },
  {
    id: 2,
    date: '2025-10-19',
    imgs: [],
    description: 'Kratší výstup s Evčou a s Eliškou. Eliščin první kopec!',
    duration: '0:52:44',
    distance: '1.98km',
    heartRate: '97 bpm',
    elevationGain: 107,
    track: kostalov01 as GeoJSON.GeoJsonObject,
  },
];
