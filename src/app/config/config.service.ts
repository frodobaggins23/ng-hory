import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppConfig, appConfigSchema, ImageCacheConfig } from './config.schema';
import { ZodError } from 'zod';

/**
 * Centralized, type-safe configuration service
 * Validates and provides access to app configuration with compile-time and runtime safety
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = this.validateAndLoadConfig();
  }

  /**
   * Load and validate configuration from environment
   * Throws an error if validation fails with detailed error information
   */
  private validateAndLoadConfig(): AppConfig {
    try {
      return appConfigSchema.parse(environment);
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues
          .map(issue => `${issue.path.join('.')}: ${issue.message}`)
          .join('\n');
        throw new Error(
          `Configuration validation failed:\n${issues}\n\nPlease check your environment.ts file.`
        );
      }
      throw error;
    }
  }

  /**
   * Get the complete validated configuration
   */
  getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Get the map API key
   */
  getMapApiKey(): string {
    return this.config.mapApiKey;
  }

  /**
   * Get the file server host URL
   */
  getFileServerHost(): string {
    return this.config.fileServerHost;
  }

  /**
   * Build a complete API URL
   */
  buildApiUrl(endpoint: string): string {
    const baseUrl = this.config.fileServerHost;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}/api${path}`;
  }

  /**
   * Build the Mapy.cz tile layer URL
   */
  buildMapTileUrl(): string {
    return `https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=${this.config.mapApiKey}`;
  }

  /**
   * Get image cache configuration
   */
  getImageCacheConfig(): ImageCacheConfig {
    return this.config.imageCache;
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this.config.production;
  }
}
