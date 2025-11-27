import { Climb } from '../types';
import { blanik01, blanik02 } from '../tracks/blanik';

export const climbsBlanik: Climb[] = [
  {
    id: 1,
    date: '2025-03-03',
    imgs: ['blanik01a02_01.webp', 'blanik01a02_02.webp'],
    description: 'Klasický výstup, ze zadu od Kondrace. Pohodové tempo.',
    duration: 2814,  // 00:46:54,
    distance: 2690,
    heartRate: 125,
    elevationGain: 259,
    track: blanik01 as GeoJSON.GeoJsonObject,
  },
  {
    id: 2,
    date: '2025-03-03',
    imgs: ['blanik01a02_01.webp', 'blanik01a02_02.webp', 'blanik02_01.webp', 'blanik02_02.webp'],
    description: 'Výstup od parkoviště na čas.',
    duration: 1011,  // 00:16:51,
    distance: 1000,
    heartRate: 148,
    elevationGain: 211,
    track: blanik02 as GeoJSON.GeoJsonObject,
  },
  {
    id: 3,
    date: '2025-05-31',
    imgs: ['blanik03_01.webp'],
    description: 'Výstup od parkoviště na čas. Tentokrát s kamarádem.',
    duration: 934,  // 00:15:34,
    distance: 1000,
    heartRate: 157,
    elevationGain: 165,
    track: blanik02 as GeoJSON.GeoJsonObject,
  },
];
