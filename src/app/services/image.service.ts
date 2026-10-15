import { Injectable, inject } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, catchError, map, share } from 'rxjs/operators';
import { ImageCacheService } from './image-cache.service';
import { RequestService } from '../request.service';
import { GalleryCryptoService } from './gallery-crypto.service';
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
  private readonly lockedPlaceholderUrl = './assets/gallery/locked-gallery.webp';

  private pendingImageRequests = new Map<string, Observable<ImageLoadResult>>();

  private cacheService = inject(ImageCacheService);
  private requestService = inject(RequestService);
  private galleryCryptoService = inject(GalleryCryptoService);

  /**
   * Get image URL for display - cache first, then encrypted asset fetch + decrypt
   */
  getImageUrl(
    mountainName: string,
    imageName: string,
    imgFolder: string
  ): Observable<ImageLoadResult> {
    if (!this.galleryCryptoService.isUnlocked()) {
      return of({ url: this.lockedPlaceholderUrl, fromCache: false });
    }

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

        // Not in cache - fetch and decrypt
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
        // Gallery may have been locked mid-flight (e.g. a stale key was
        // cleared concurrently) - fall back to the placeholder instead of
        // surfacing an error for what is really just a locked state.
        if (!this.galleryCryptoService.isUnlocked()) {
          return of({ url: this.lockedPlaceholderUrl, fromCache: false });
        }
        console.error('Error loading image:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetch the encrypted image asset, decrypt it client-side, and store the
   * decrypted blob in cache
   */
  private downloadAndCacheImage(
    mountainName: string,
    imageName: string,
    imgFolder: string
  ): Observable<ImageLoadResult> {
    const mountainId = MountainUtils.normalizeMountainName(mountainName);

    const url = `./assets/gallery/${encodeURIComponent(imgFolder)}/${encodeURIComponent(imageName)}.enc`;

    return this.requestService
      .request({
        method: 'get',
        path: url,
        responseType: 'arraybuffer',
      })
      .pipe(
        switchMap((buffer: ArrayBuffer) =>
          from(this.galleryCryptoService.decryptToBlob(buffer, 'image/webp'))
        ),
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
