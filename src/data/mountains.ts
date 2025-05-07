import { Mountain } from './types';
import { climbsSnezka } from './climbs/climbs-snezka';
import { climbsJested } from './climbs/climbs-jested';
import { climbsLovos } from './climbs/climbs-lovos';
import { climbsMilesovka } from './climbs/climbs-milesovka';
import { climbsRip } from './climbs/climbs-rip';
import { climbsRalsko } from './climbs/climbs-ralsko';
import { climbsBlanik } from './climbs/climbs-blanik';

export const mountains: Mountain[] = [
  {
    name: 'Ještěd',
    coordinates: [50.7326181, 14.9850481],
    climbs: climbsJested,
  },
  {
    name: 'Sněžka',
    coordinates: [50.73602, 15.7396017],
    climbs: climbsSnezka,
  },
  {
    name: 'Lovoš',
    coordinates: [50.5276125, 14.01802],
    climbs: climbsLovos,
  },
  {
    name: 'Milešovka',
    coordinates: [50.554905, 13.9310911],
    climbs: climbsMilesovka,
  },
  {
    name: 'Říp',
    coordinates: [50.3865333, 14.2896225],
    climbs: climbsRip,
  },
  {
    name: 'Ralsko',
    coordinates: [50.6741994, 14.7659739],
    climbs: climbsRalsko,
  },
  {
    name: 'Blaník',
    coordinates: [49.6418089, 14.8736789],
    climbs: climbsBlanik,
  },
];
