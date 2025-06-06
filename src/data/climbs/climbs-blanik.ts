import { Climb } from '../types';
import { blanik01, blanik02 } from '../tracks/blanik';

export const climbsBlanik: Climb[] = [
  {
    id: 1,
    date: '2025-03-03',
    imgs: ['blanik.jpg'],
    description: 'Klasický výstup, ze zadu od Kondrace. Pohodové tempo.',
    duration: '00:46:54',
    distance: '2.69 km',
    heartRate: '125 bpm',
    elevationGain: 259,
    track: blanik01 as GeoJSON.GeoJsonObject,
  },
  {
    id: 2,
    date: '2025-03-03',
    imgs: ['blanik.jpg'],
    description: 'Výstup od parkoviště na čas.',
    duration: '00:16:51',
    distance: '1 km',
    heartRate: '148 bpm',
    elevationGain: 211,
    track: blanik02 as GeoJSON.GeoJsonObject,
  },
  {
    id: 3,
    date: '2025-05-31',
    imgs: ['blanik.jpg'],
    description: 'Výstup od parkoviště na čas. Tentokrát s kamarádem.',
    duration: '00:15:34',
    distance: '1 km',
    heartRate: '157 bpm',
    elevationGain: 165,
    track: blanik02 as GeoJSON.GeoJsonObject,
  },
];
