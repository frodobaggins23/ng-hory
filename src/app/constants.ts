/**
 * NOTE: This file is kept for backwards compatibility only.
 * New code should use ConfigService to get the MAPY_CZ_URL dynamically.
 * See ConfigService.buildMapTileUrl() for the recommended approach.
 */

import { ConfigService } from './config/config.service';

/**
 * Utility function to get the Mapy.cz URL
 * Must be called at runtime after ConfigService is initialized
 */
export function getMapyCzUrl(configService: ConfigService): string {
  const apiKey = configService.getMapApiKey();
  return `https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=${apiKey}`;
}

/**
 * Legacy constant - DO NOT USE in new code
 * This was hardcoded to environment.mapApiKey at compile time
 * Use getMapyCzUrl() instead
 * @deprecated
 */
export const MAPY_CZ_URL = '';
