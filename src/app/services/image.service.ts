import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, catchError, tap, share } from 'rxjs/operators';
import { GoogleDriveService, DriveImageMetadata } from './google-drive.service';
import { ImageCacheService } from './image-cache.service';
import { mountains } from '../../data/mountains';
import { MountainUtils, RxJSUtils, BlobUtils } from '../utils';

export interface ImageLoadResult {
  url: string;
  fromCache: boolean;
  size?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private folderImageCache = new Map<string, DriveImageMetadata[]>();
  private pendingFolderRequests = new Map<string, Observable<DriveImageMetadata[]>>();
  private pendingImageRequests = new Map<string, Observable<ImageLoadResult>>();

  constructor(
    private driveService: GoogleDriveService,
    private cacheService: ImageCacheService
  ) {}

  /**
   * Get image URL for display - cache first, then Drive download
   */
  getImageUrl(mountainName: string, imageName: string): Observable<ImageLoadResult> {
    const imageKey = MountainUtils.createImageKey(mountainName, imageName);
    const mountainId = MountainUtils.normalizeMountainName(mountainName);
    
    // First check cache
    return this.cacheService.getImage(mountainId, imageName).pipe(
      switchMap(cachedBlob => {
        if (cachedBlob) {
          // Return cached image
          const url = BlobUtils.createBlobUrl(cachedBlob);
          return of({
            url,
            fromCache: true,
            size: cachedBlob.size
          });
        }

        // Check if download is already pending for this image
        const pendingRequest = this.pendingImageRequests.get(imageKey);
        if (pendingRequest) {
          return pendingRequest;
        }

        // Not in cache - download from Drive
        const downloadRequest$ = this.downloadAndCacheImage(mountainName, imageName).pipe(
          RxJSUtils.cleanupMapEntry(this.pendingImageRequests, imageKey),
          share() // Share the Observable to prevent multiple downloads
        );

        // Cache the pending request
        this.pendingImageRequests.set(imageKey, downloadRequest$);
        return downloadRequest$;
      }),
      catchError(error => {
        console.error('Error loading image:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Preload images for a mountain (inspect folder and cache metadata)
   */
  preloadMountainImages(mountainName: string): Observable<DriveImageMetadata[]> {
    const mountain = mountains.find(m => m.name === mountainName);
    if (!mountain?.driveFolderId) {
      return throwError(() => new Error(`No Drive folder configured for mountain: ${mountainName}`));
    }

    // Check if already cached
    const cached = this.folderImageCache.get(mountainName);
    if (cached) {
      return of(cached);
    }

    // Check if request is already pending
    const pending = this.pendingFolderRequests.get(mountainName);
    if (pending) {
      return pending;
    }

    // Create new request and cache it
    const request$ = this.driveService.inspectFolder(mountain.driveFolderId).pipe(
      tap(result => {
        // Cache the metadata
        this.folderImageCache.set(mountainName, result.images);
      }),
      map(result => result.images),
      RxJSUtils.cleanupMapEntry(this.pendingFolderRequests, mountainName),
      catchError(RxJSUtils.logAndRethrow('Error preloading mountain images')),
      share() // Share the Observable to prevent multiple API calls
    );

    // Cache the pending request
    this.pendingFolderRequests.set(mountainName, request$);
    return request$;
  }

  /**
   * Get all available images for a mountain
   */
  getMountainImages(mountainName: string): Observable<string[]> {
    return this.preloadMountainImages(mountainName).pipe(
      map(images => images.map(img => img.name))
    );
  }

  /**
   * Download image from Drive and store in cache
   */
  private downloadAndCacheImage(mountainName: string, imageName: string): Observable<ImageLoadResult> {
    const mountain = mountains.find(m => m.name === mountainName);
    if (!mountain?.driveFolderId) {
      return throwError(() => new Error(`Drive folder not configured for ${mountainName}. Please check mountain data.`));
    }

    // Get folder metadata first
    return this.preloadMountainImages(mountainName).pipe(
      switchMap(images => {
        const imageMetadata = this.driveService.findImageByName(images, imageName);
        if (!imageMetadata) {
          return throwError(() => new Error(`Image '${imageName}' not found in ${mountainName} Drive folder`));
        }

        // Download the image
        return this.driveService.downloadImage(imageMetadata.id).pipe(
          switchMap(blob => {
            const mountainId = MountainUtils.normalizeMountainName(mountainName);
            
            // Store in cache
            return this.cacheService.storeImage(mountainId, imageName, blob, imageMetadata.id).pipe(
              map(() => ({
                url: BlobUtils.createBlobUrl(blob),
                fromCache: false,
                size: blob.size
              }))
            );
          }),
          catchError(error => {
            console.error(`Failed to download image ${imageName} for ${mountainName}:`, error);
            return throwError(() => new Error(`Download failed: ${error.message || 'Network error'}`));
          })
        );
      }),
      catchError(error => {
        console.error(`Error accessing ${mountainName} Drive folder:`, error);
        return throwError(() => new Error(`Drive folder access failed: ${error.message || 'Check API key and permissions'}`));
      })
    );
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cacheService.getCacheStats();
  }

  /**
   * Clear image cache
   */
  clearCache() {
    return this.cacheService.clearCache();
  }

  /**
   * Legacy CDN URL method - temporary for compatibility
   * @deprecated Use getImageUrl() instead
   */
  getCdnUrl(imageName: string): string {
    // Temporary fallback to avoid TypeScript errors
    console.warn('getCdnUrl is deprecated, use getImageUrl() instead');
    return `https://via.placeholder.com/400x300?text=${encodeURIComponent(imageName)}`;
  }
}
