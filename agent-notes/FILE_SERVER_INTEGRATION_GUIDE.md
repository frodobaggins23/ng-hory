# File Server Integration Guide

## Overview

Image serving system using a custom Express.js file server with IndexedDB caching on the client side. The system implements cache-first strategy with LRU (Least Recently Used) eviction.

## Architecture

```
User Request → ImageService → Check IndexedDB Cache
                    ↓
              [Cache Hit] → Return cached image
                    ↓
              [Cache Miss] → File Server (Express.js) → Return image + Store in cache
```

## Key Components

### 1. File Server
**Location:** `node-servers/file-server/`

**Main Files:**
- `server.js` - Express server with secure file serving endpoint
- `utils.js` - Path sanitization and CORS configuration
- `utils.test.js` - Comprehensive test suite
- `file-storage/` - Protected directory containing image folders

**Key Features:**
- Secure file serving with path traversal protection
- CORS configuration (localhost + kubac.website)
- Query params: `?folder=<imgFolder>&filename=<imageName>`
- Endpoint: `GET /api/get-file`

**Security:**
- Path sanitization prevents directory traversal attacks
- Files must be within `file-storage/` directory
- CORS whitelist for allowed origins

### 2. Angular Services

#### ImageService
**Location:** `src/app/services/image.service.ts`

**Responsibilities:**
- Orchestrates image loading with cache-first strategy
- Downloads images from file server
- Stores downloaded images in IndexedDB cache
- Deduplicates concurrent requests for same image

**Key Method:**
```typescript
getImageUrl(mountainName: string, imageName: string, imgFolder: string): Observable<ImageLoadResult>
```

#### ImageCacheService
**Location:** `src/app/services/image-cache.service.ts`

**Responsibilities:**
- IndexedDB management for image caching
- LRU eviction when cache is full
- Cache statistics and management

**Database Schema:**
- Database: `HoryImageCache`
- Store: `imageCache`
- Key: `mountainId:imageName`
- Indexes: `lastAccessed`, `mountainId`

**LRU Eviction:**
- Configured max: 15 images, 75MB total
- Evicts oldest accessed images when limit reached
- Updates `lastAccessed` timestamp on every retrieval

### 3. Mountain Data Structure

**Location:** `src/data/mountains.ts`, `src/data/types.ts`

Each mountain has:
- `name` - Display name
- `coordinates` - Map coordinates
- `climbs` - Array of climb records
- `imgFolder` - Folder name in file server (e.g., 'jested', 'lovos')

### 4. Utility Functions

**Location:** `src/app/utils/`

- `BlobUtils` - Blob URL creation and cleanup
- `MountainUtils` - Mountain name normalization and key generation
- `RxJSUtils` - Observable error handling and cleanup
- `ImageStateUtils` - Image state management helpers
- `IndexedDBUtils` - IndexedDB operation wrappers

## Component Integration

### Using ImageService in Components

Components pass mountain's `imgFolder` to image service:

```typescript
this.imageService.getImageUrl(mountainName, imageName, mountain.imgFolder)
```

**Components using ImageService:**
- `photo-gallery.component.ts` - Image gallery display
- `table.component.ts` - Thumbnail display in climb table
- `expand-content.component.ts` - Passes imgFolder to gallery

## Environment Configuration

**Location:** `src/environments/environment.ts`

**Key Variables:**
- `fileServerHost` - File server URL (injected by `scripts/inject-env.js`)
- `mapApiKey` - Mapy.cz API key (injected)
- `imageCache` - Cache size limits configuration

**Environment Variables:**
- `FILE_SERVER_HOST` - e.g., 'http://localhost:3000' (dev) or 'https://api.kubac.website' (prod)
- `MAP_API_KEY` - Mapy.cz API key

## Development Setup

1. **Start file server:**
   ```bash
   cd node-servers/file-server
   npm install
   npm start  # http://localhost:3000
   ```

2. **Set environment variables:**
   ```bash
   export FILE_SERVER_HOST="http://localhost:3000"
   export MAP_API_KEY="your_key"
   ```

3. **Inject environment and start Angular:**
   ```bash
   node scripts/inject-env.js
   ng serve
   ```

## Production Deployment

1. Set production environment variables
2. Run `node scripts/inject-env.js`
3. Build: `ng build --configuration production`
4. Deploy file server (use PM2 or systemd)
5. Configure Nginx reverse proxy for file server
6. Deploy Angular dist/ files

## Key Principles

### Cache-First Strategy
1. Check IndexedDB cache first
2. Return cached image if available (instant)
3. Download from file server if not cached
4. Store downloaded image in cache for future use

### LRU Eviction
- Tracks `lastAccessed` timestamp for each cached image
- When cache is full, deletes oldest accessed images
- Ensures frequently accessed images stay cached

### Security
- Path sanitization removes `..`, `/`, `\` from paths
- `isPathWithinDirectory()` validates resolved paths
- CORS whitelist prevents unauthorized origins

### Memory Management
- Blob URLs are created with `URL.createObjectURL()`
- Blob URLs are revoked with `URL.revokeObjectURL()` on component destroy
- Prevents memory leaks from unreleased blob references

## File Structure Reference

```
ng-hory/
├── node-servers/file-server/
│   ├── server.js              # Express server
│   ├── utils.js               # Security utilities
│   ├── utils.test.js          # Tests
│   └── file-storage/          # Image storage
│       ├── jested/
│       ├── lovos/
│       └── ...
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   ├── image.service.ts          # Main image orchestration
│   │   │   └── image-cache.service.ts    # IndexedDB cache
│   │   ├── utils/                        # Shared utilities
│   │   ├── photo-gallery/                # Gallery component
│   │   └── mountain-detail/
│   │       ├── table/                    # Climb table with thumbnails
│   │       └── expand-content/           # Expanded climb details
│   ├── data/
│   │   ├── mountains.ts                  # Mountain data
│   │   └── types.ts                      # Type definitions
│   ├── environments/
│   │   └── environment.ts                # Environment config
│   └── scripts/
│       └── inject-env.js                 # Environment injection
```

## Testing

**File Server Tests:** `node-servers/file-server/utils.test.js`
- Path sanitization tests
- CORS validation tests
- Security boundary tests

**Run Tests:**
```bash
cd node-servers/file-server
npm test
```

## Troubleshooting

**Images not loading:**
- Check file server is running
- Verify `fileServerHost` in environment.ts
- Check browser console for CORS errors
- Verify image files exist in `file-storage/<imgFolder>/`

**CORS errors:**
- Ensure origin matches whitelist in `utils.js`
- Check CORS middleware is applied in `server.js`

**Cache issues:**
- Clear IndexedDB: Browser DevTools → Application → IndexedDB → Delete
- Check cache stats via `imageService.getCacheStats()`
- Verify IndexedDB browser support

## Browser DevTools

**View IndexedDB:**
Chrome DevTools → Application → Storage → IndexedDB → HoryImageCache → imageCache

**Monitor Performance:**
Console logs show cache hits/misses and load times when enabled.
