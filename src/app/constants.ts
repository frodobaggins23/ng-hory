import { environment } from '../environments/environment';

export const MAPY_CZ_URL =
  'https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=' + environment.mapApiKey;
