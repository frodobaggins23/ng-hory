# Type-Safe Configuration System

This directory contains the app's centralized, type-safe configuration system powered by **Zod** for runtime validation.

## Overview

The configuration system provides:
- ✅ **Compile-time type safety**: Full TypeScript support
- ✅ **Runtime validation**: Zod schemas catch config errors at startup
- ✅ **Centralized access**: Single source of truth for all configuration
- ✅ **Easy testing**: Straightforward mocking and validation

## Files

### `config.schema.ts`
Defines the Zod validation schemas:
- `imageCacheConfigSchema` - Image caching configuration
- `appConfigSchema` - Complete app configuration (includes image cache)

Exported types:
- `ImageCacheConfig` - Typed image cache settings
- `AppConfig` - Typed complete configuration

### `config.service.ts`
Injectable service that:
1. Loads configuration from `environment.ts` at app startup
2. Validates it against `appConfigSchema`
3. Throws detailed error messages if validation fails
4. Provides typed accessors for configuration values

#### Key Methods

```typescript
// Get specific values
getMapApiKey(): string
getFileServerHost(): string
getImageCacheConfig(): ImageCacheConfig
isProduction(): boolean

// Build URLs
buildApiUrl(endpoint: string): string      // Builds /api/{endpoint}
buildMapTileUrl(): string                  // Builds Mapy.cz tile URL

// Get full config
getConfig(): AppConfig
```

### `config.service.spec.ts`
Unit tests for the configuration service.

## Setup Instructions

### 1. Development Environment

Copy the template and fill in your secrets:

```bash
cp src/environments/environment.development.ts.template src/environments/environment.development.ts
```

Edit `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  mapApiKey: 'YOUR_ACTUAL_API_KEY',
  fileServerHost: 'http://localhost:3000',
  imageCache: {
    maxImages: 15,
    maxSizePerImage: 5 * 1024 * 1024,
    maxTotalSize: 75 * 1024 * 1024,
  },
} as const;
```

### 2. Production Environment

Update `src/environments/environment.ts` with actual values or use build-time injection:

```typescript
export const environment = {
  production: true,
  mapApiKey: process.env['MAP_API_KEY'] || '',
  fileServerHost: process.env['FILE_SERVER_HOST'] || '',
  imageCache: { /* ... */ },
} as const;
```

The `prebuild` script in `package.json` injects secrets via `scripts/inject-env.js`.

### 3. Environment Variables

For production builds, set these environment variables:

```bash
export MAP_API_KEY="your-mapy-cz-api-key"
export FILE_SERVER_HOST="https://your-file-server.com"
npm run build
```

## Using Configuration in Components/Services

Always use `ConfigService` instead of importing `environment` directly:

### ✅ DO - Use ConfigService

```typescript
import { Component, inject } from '@angular/core';
import { ConfigService } from '../config/config.service';

@Component({ /* ... */ })
export class MyComponent {
  private config = inject(ConfigService);

  imageServerUrl = this.config.getFileServerHost();
  apiUrl = this.config.buildApiUrl('my-endpoint');
  mapTileUrl = this.config.buildMapTileUrl();
}
```

### ❌ DON'T - Import environment directly

```typescript
// ❌ BAD - Type-unsafe, compile-time only
import { environment } from '../../environments/environment';
const url = environment.fileServerHost;
```

## Adding New Configuration

To add a new configuration field:

1. **Update the schema** in `config.schema.ts`:
   ```typescript
   export const appConfigSchema = z.object({
     // existing fields...
     myNewField: z.string().describe('Description of my new field'),
   });
   ```

2. **Update environment files**:
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     // existing fields...
     myNewField: 'value',
   };
   ```

3. **Add accessor to ConfigService**:
   ```typescript
   getMyNewField(): string {
     return this.config.myNewField;
   }
   ```

4. **Update tests** in `config.service.spec.ts`

## Error Handling

If configuration validation fails at startup, you'll see a detailed error:

```
Error: Configuration validation failed:
fileServerHost: Invalid url
mapApiKey: String must contain at least 1 character(s)
```

This prevents silent failures and makes debugging easy.

## Testing

Mock the ConfigService in tests:

```typescript
import { ConfigService } from './config.service';

TestBed.configureTestingModule({
  providers: [
    {
      provide: ConfigService,
      useValue: {
        getFileServerHost: () => 'http://test-server.com',
        buildApiUrl: (endpoint) => `http://test-server.com/api${endpoint}`,
        getMapApiKey: () => 'test-key',
        isProduction: () => false,
      },
    },
  ],
});
```

## Security Considerations

- **Never commit secrets** - Use `.env` file (in .gitignore)
- **Validate at startup** - Catches missing secrets early
- **Use environment variables** for production
- **Keep environment.ts clean** - It's the template, not the actual config
