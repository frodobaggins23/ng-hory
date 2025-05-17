import { Climb } from '../types';
import test01 from '../tracks/lovos/test1.json';

export const climbsLovos: Climb[] = [
  {
    id: 1,
    date: '2023-07-10',
    img: '/img/lovos.jpg',
    description:
      'Lovoš is a volcanic hill in the Czech Republic, offering panoramic views of the Central Bohemian Uplands.',
    duration: '2 hours',
    distance: '5 km',
    heartRate: '110 bpm',
    track: test01 as GeoJSON.GeoJsonObject,
  },
  {
    id: 2,
    date: '2023-07-11',
    description:
      'The trail to Lovoš is short but steep, making it a great choice for a quick yet rewarding hike.',
    duration: '3 hours',
    distance: '6 km',
    heartRate: '115 bpm',
  },
];
