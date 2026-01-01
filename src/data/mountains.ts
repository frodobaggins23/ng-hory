import { Mountain } from './types';
import { climbsBabka } from './climbs/climbs-babka';
import { climbsKostalov } from './climbs/climbs-kostalov';
import { climbsJested } from './climbs/climbs-jested';
import { climbsLovos } from './climbs/climbs-lovos';
import { climbsMilesovka } from './climbs/climbs-milesovka';
import { climbsLipskaHora } from './climbs/climbs-lipska-hora';
import { climbsRalsko } from './climbs/climbs-ralsko';
import { climbsBlanik } from './climbs/climbs-blanik';
import { climbsOstry } from './climbs/climbs-ostry';
import { climbsBezdez } from './climbs/climbs-bezdez';
import { climbsRonov } from './climbs/climbs-ronov';
import { climbsRip } from './climbs/climbs-rip';

export const mountains: Mountain[] = [
  {
    name: 'Babka',
    description: 'Krásný vrcholek v brdských lesích',
    location: 'Středočeský kraj',
    altitude: 506,
    coordinates: [49.8914769, 14.23623],
    climbs: climbsBabka,
    imgFolder: 'babka',
  },
  {
    name: 'Ještěd',
    description: 'Dominanta Liberce s unikátní televizní věží',
    location: 'Liberecký kraj',
    altitude: 1012,
    coordinates: [50.7326181, 14.9850481],
    climbs: climbsJested,
    imgFolder: 'jested',
  },
  {
    name: 'Lovoš',
    description: 'Můj oblíbený kopec s krásnými výhledy na České středohoří',
    location: 'Ústecký kraj',
    altitude: 573,
    coordinates: [50.5276125, 14.01802],
    climbs: climbsLovos,
    imgFolder: 'lovos',
  },
  {
    name: 'Milešovka',
    description: 'Nejvyšší hora Českého středohoří',
    location: 'Ústecký kraj',
    altitude: 837,
    coordinates: [50.554905, 13.9310911],
    climbs: climbsMilesovka,
    imgFolder: 'milesovka',
  },
  {
    name: 'Ralsko',
    description: 'Parádní kopec se zříceninou hradu na vrcholu',
    location: 'Liberecký kraj',
    altitude: 698,
    coordinates: [50.6741994, 14.7659739],
    climbs: climbsRalsko,
    imgFolder: 'ralsko',
  },
  {
    name: 'Blaník',
    description: 'Legendární hora spojená s českými pověstmi',
    location: 'Středočeský kraj',
    altitude: 638,
    coordinates: [49.6418089, 14.8736789],
    climbs: climbsBlanik,
    imgFolder: 'blanik',
  },
  {
    name: 'Koštálov',
    description: 'Takový nenápadný kopec, s dechberoucími výhledy',
    location: 'Ústecký kraj',
    altitude: 494,
    coordinates: [50.4902408, 13.9847233],
    climbs: climbsKostalov,
    imgFolder: 'kostalov',
  },
  {
    name: 'Lipská hora',
    description: 'Asi nejlepší výhledy v Českém středohoří',
    location: 'Ústecký kraj',
    altitude: 698,
    coordinates: [50.5124383, 13.9128083],
    climbs: climbsLipskaHora,
    imgFolder: 'lipska_hora',
  },
  {
    name: 'Ostrý',
    description: 'Skalnatý vrchol s nádhernými výhledy na Milešovku',
    location: 'Ústecký kraj',
    altitude: 553,
    coordinates: [50.5313833, 13.9514528],
    climbs: climbsOstry,
    imgFolder: 'ostry',
  },
  {
    name: 'Bezděz',
    description: 'Historický hrad na vrcholu kopce s panoramatickými výhledy',
    location: 'Liberecký kraj',
    altitude: 606,
    coordinates: [50.5390411, 14.7198908],
    climbs: climbsBezdez,
    imgFolder: 'bezdez',
  },
  {
    name: 'Ronov',
    description: 'Kopec se zříceninou hradu na vrcholu',
    location: 'Liberecký kraj',
    altitude: 552,
    coordinates: [50.6203203, 14.4145292],
    climbs: climbsRonov,
    imgFolder: 'ronov',
  },
  {
    name: 'Říp',
    description: 'Tenhle kopec je pro mě návrat do dětství',
    location: 'Středočeský kraj',
    altitude: 460,
    coordinates: [50.3865333, 14.2896225],
    climbs: climbsRip,
    imgFolder: 'rip',
  },
];
