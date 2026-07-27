import { z } from 'zod';

export const imageCacheConfigSchema = z.object({
  maxImages: z.number().int().positive().describe('Maximum number of images to cache'),
  maxSizePerImage: z.number().int().positive().describe('Maximum size per image in bytes'),
  maxTotalSize: z.number().int().positive().describe('Maximum total cache size in bytes'),
});

export const appConfigSchema = z.object({
  production: z.boolean().describe('Whether the app is in production mode'),
  mapApiKey: z.string().min(1).describe('API key for map provider (Mapy.cz)'),
  fileServerHost: z.string().url().describe('Base URL for the file server'),
  imageCache: imageCacheConfigSchema,
});

export type ImageCacheConfig = z.infer<typeof imageCacheConfigSchema>;
export type AppConfig = z.infer<typeof appConfigSchema>;
