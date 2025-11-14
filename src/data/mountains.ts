import { Mountain } from './types';
import { climbsKostalov } from './climbs/climbs-kostalov';
import { climbsJested } from './climbs/climbs-jested';
import { climbsLovos } from './climbs/climbs-lovos';
import { climbsMilesovka } from './climbs/climbs-milesovka';
import { climbsLipskaHora } from './climbs/climbs-lipska-hora';
import { climbsRalsko } from './climbs/climbs-ralsko';
import { climbsBlanik } from './climbs/climbs-blanik';

export const mountains: Mountain[] = [
  {
    name: 'Ještěd',
    coordinates: [50.7326181, 14.9850481],
    climbs: climbsJested,
    imgFolder: 'jested',
  },
  {
    name: 'Lovoš',
    coordinates: [50.5276125, 14.01802],
    climbs: climbsLovos,
    imgFolder: 'lovos',
  },
  {
    name: 'Milešovka',
    coordinates: [50.554905, 13.9310911],
    climbs: climbsMilesovka,
    imgFolder: 'milesovka',
  },
  {
    name: 'Ralsko',
    coordinates: [50.6741994, 14.7659739],
    climbs: climbsRalsko,
    imgFolder: 'ralsko',
  },
  {
    name: 'Blaník',
    coordinates: [49.6418089, 14.8736789],
    climbs: climbsBlanik,
    imgFolder: 'blanik',
  },
  {
    name: 'Koštálov',
    coordinates: [50.4902408, 13.9847233],
    climbs: climbsKostalov,
    imgFolder: 'kostalov',
  },
  {
    name: 'Lipská hora',
    coordinates: [50.5124383, 13.9128083],
    climbs: climbsLipskaHora,
    imgFolder: 'lipska-hora',
  },
];
