export { climbsBabka } from './climbs-babka';
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
import { climbsBabka } from './climbs-babka';
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

import { Climb, MountainName } from '../types';

export const allClimbsMap: Record<MountainName, Climb[]> = {
  Babka: climbsBabka,
  Bezděz: climbsBezdez,
  Blaník: climbsBlanik,
  Koštálov: climbsKostalov,
  Ještěd: climbsJested,
  'Lipská hora': climbsLipskaHora,
  Lovoš: climbsLovos,
  Milešovka: climbsMilesovka,
  Ostrý: climbsOstry,
  Ralsko: climbsRalsko,
  Říp: climbsRip,
  Ronov: climbsRonov,
};
