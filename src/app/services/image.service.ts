import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, catchError, map, share } from 'rxjs/operators';
import { ImageCacheService } from './image-cache.service';
import { RequestService } from '../request.service';
import { MountainUtils, RxJSUtils, BlobUtils } from '../utils';
import { ConfigService } from '../config/config.service';

export interface ImageLoadResult {
  url: string;
  fromCache: boolean;
  size?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private pendingImageRequests = new Map<string, Observable<ImageLoadResult>>();

  private cacheService = inject(ImageCacheService);
  private requestService = inject(RequestService);
  private configService = inject(ConfigService);

  /**
   * Get image URL for display - cache first, then file server download
   */
  getImageUrl(
    mountainName: string,
    imageName: string,
    imgFolder: string
  ): Observable<ImageLoadResult> {
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
            size: cachedBlob.size,
          });
        }

        // Check if download is already pending for this image
        const pendingRequest = this.pendingImageRequests.get(imageKey);
        if (pendingRequest) {
          return pendingRequest;
        }

        // Not in cache - download from file server
        const downloadRequest$ = this.downloadAndCacheImage(
          mountainName,
          imageName,
          imgFolder
        ).pipe(
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
   * Download image from file server and store in cache
   */
  private downloadAndCacheImage(
    mountainName: string,
    imageName: string,
    imgFolder: string
  ): Observable<ImageLoadResult> {
    const mountainId = MountainUtils.normalizeMountainName(mountainName);

    // Construct file server URL using imgFolder
    const baseUrl = this.configService.getFileServerHost();
    const url = `${baseUrl}/api/get-file?folder=${encodeURIComponent(imgFolder)}&filename=${encodeURIComponent(imageName)}`;

    // Download the image from file server
    return this.requestService
      .request({
        method: 'get',
        path: url,
        responseType: 'blob',
      })
      .pipe(
        switchMap((blob: Blob) => {
          // Store in cache
          return this.cacheService.storeImage(mountainId, imageName, blob).pipe(
            map(() => ({
              url: BlobUtils.createBlobUrl(blob),
              fromCache: false,
              size: blob.size,
            }))
          );
        }),
        catchError(error => {
          console.error(`Failed to download image ${imageName} for ${mountainName}:`, error);
          return throwError(
            () => new Error(`Download failed: ${error.message || 'Network error'}`)
          );
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
}
