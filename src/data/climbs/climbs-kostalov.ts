import { kostalov01 } from '../tracks/kostalov';
import { Climb } from '../types';

export const climbsKostalov: Climb[] = [
  {
    id: 1,
    date: '2025-05-24',
    imgs: ['kostalov.jpg'],
    description:
      'Prvovýstup na zříceninu hradu. Vybrána trasa s největším převýšením. Krásné výhledy na okolní krajinu.',
    duration: '0:37:59',
    distance: '2.41 km',
    heartRate: '130 bpm',
    elevationGain: 298,
    track: kostalov01 as GeoJSON.GeoJsonObject,
  },
];
