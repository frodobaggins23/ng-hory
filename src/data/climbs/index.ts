export { climbsBezdez } from './climbs-bezdez';
export { climbsBlanik } from './climbs-blanik';
export { climbsKostalov } from './climbs-kostalov';
export { climbsJested } from './climbs-jested';
export { climbsLipskaHora } from './climbs-lipska-hora';
export { climbsLovos } from './climbs-lovos';
export { climbsMilesovka } from './climbs-milesovka';
export { climbsOstry } from './climbs-ostry';
export { climbsRalsko } from './climbs-ralsko';
export { climbsRip } from './climbs-rip';
export { climbsRonov } from './climbs-ronov';

// for stats
import { climbsBezdez } from './climbs-bezdez';
import { climbsBlanik } from './climbs-blanik';
import { climbsKostalov } from './climbs-kostalov';
import { climbsJested } from './climbs-jested';
import { climbsLipskaHora } from './climbs-lipska-hora';
import { climbsLovos } from './climbs-lovos';
import { climbsMilesovka } from './climbs-milesovka';
import { climbsOstry } from './climbs-ostry';
import { climbsRalsko } from './climbs-ralsko';
import { climbsRip } from './climbs-rip';
import { climbsRonov } from './climbs-ronov';
import { Climb } from '../types';

export const allClimbs: Climb[] = [
  ...climbsBezdez,
  ...climbsBlanik,
  ...climbsKostalov,
  ...climbsJested,
  ...climbsLipskaHora,
  ...climbsLovos,
  ...climbsMilesovka,
  ...climbsOstry,
  ...climbsRalsko,
  ...climbsRip,
  ...climbsRonov,
];
