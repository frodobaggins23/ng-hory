import { Climb } from '../types';

export const climbsOstry: Climb[] = [
  {
    id: 1,
    date: '2025-10-11',
    imgs: ['ostry01_01.webp', 'ostry01_02.webp', 'ostry01_03.webp'],
    description:
      'Prvovýstup na Ostrý. Krásná vyhlídka z vrcholu. Je tam dokonce lavička, odkud se dá koukat na Milešovku.',
    duration: 2250, // 0:37:30,
    distance: 2260,
    heartRate: 142,
    elevationGain: 227,
  },
  {
    id: 2,
    date: '2026-03-07',
    description:
      'Byl první opravdu pěkný jarní den, takže na vrcholu byly davy a moc jsem tam nezdržel. Bohužel byl taky opar, takže výhledy nic moc.',
    duration: 2322, // 0:38:42
    distance: 2280,
    heartRate: 133,
    elevationGain: 223,
    trackPath: './assets/tracks/ostry/ostry02.json',
  },
];
