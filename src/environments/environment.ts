export const environment = {
  production: true,
  apiKey: 'KjyC3fA7h5K85KSxtf8czTIDggXXGkUirvOF_c6Hp_E', // Placeholder for API key (legacy)
  cdnHost: 'https://ik.imagekit.io/', // Legacy CDN (will be replaced by Drive)
  cdnFolder: 'a2nerrafe', // Placeholder for CDN folder (legacy)
  
  // Google Drive configuration - injected by scripts/inject-env.js
  googleDriveApiKey: '', // Placeholder for Google Drive API key
  
  // Image cache settings
  imageCache: {
    maxImages: 15,
    maxSizePerImage: 5 * 1024 * 1024, // 5MB
    maxTotalSize: 75 * 1024 * 1024    // 75MB
  }
};
