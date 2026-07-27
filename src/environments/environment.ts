export const environment = {
  production: true,

  // Map API key - injected by scripts/inject-env.js
  // REQUIRED: Must be provided via environment.production.ts or build-time injection
  mapApiKey: process.env['MAP_API_KEY'] || '',

  // File server configuration - injected by scripts/inject-env.js
  // REQUIRED: Must be provided via environment.production.ts or build-time injection
  fileServerHost: process.env['FILE_SERVER_HOST'] || '',

  // Image cache settings
  imageCache: {
    maxImages: 15,
    maxSizePerImage: 5 * 1024 * 1024, // 5MB
    maxTotalSize: 75 * 1024 * 1024, // 75MB
  },
} as const;
