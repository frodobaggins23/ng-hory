export const environment = {
  production: true,

  // Map API key - injected by scripts/inject-env.js
  mapApiKey: '', // Placeholder for Mapy.cz API key

  // File server configuration - injected by scripts/inject-env.js
  fileServerHost: '', // Placeholder for file server host

  // Image cache settings
  imageCache: {
    maxImages: 15,
    maxSizePerImage: 5 * 1024 * 1024, // 5MB
    maxTotalSize: 75 * 1024 * 1024, // 75MB
  },
};
