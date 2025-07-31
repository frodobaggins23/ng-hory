import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { IndexedDBUtils, RxJSUtils } from '../utils';

export interface CachedImage {
  id: string; // composite key: "mountainId:imageName"
  mountainId: string;
  imageName: string;
  blob: Blob;
  mimeType: string;
  size: number; // bytes
  lastAccessed: Date;
  downloadDate: Date;
  driveFileId: string;
}

export interface CacheStats {
  totalImages: number;
  totalSize: number;
  availableSlots: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImageCacheService {
  private readonly DB_NAME = 'HoryImageCache';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'imageCache';
  private readonly MAX_IMAGES = 50;
  private readonly MAX_SIZE_PER_IMAGE = 5 * 1024 * 1024; // 5MB
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('lastAccessed', 'lastAccessed', { unique: false });
          store.createIndex('mountainId', 'mountainId', { unique: false });
        }
      };
    });
  }

  /**
   * Get image from cache
   */
  getImage(mountainId: string, imageName: string): Observable<Blob | null> {
    const key = `${mountainId}:${imageName}`;

    return from(this.ensureDB()).pipe(
      switchMap(() => {
        return from(
          IndexedDBUtils.wrapOperation(() => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            return store.get(key);
          }).then((cachedImage: CachedImage | undefined) => {
            if (cachedImage) {
              // Update last accessed time in a separate transaction
              cachedImage.lastAccessed = new Date();
              return IndexedDBUtils.wrapOperation(() => {
                const updateTransaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
                const updateStore = updateTransaction.objectStore(this.STORE_NAME);
                return updateStore.put(cachedImage);
              }).then(() => cachedImage.blob);
            }
            return null;
          })
        );
      }),
      catchError(RxJSUtils.logAndRethrow('Error getting cached image'))
    );
  }

  /**
   * Store image in cache with LRU eviction
   */
  storeImage(
    mountainId: string,
    imageName: string,
    blob: Blob,
    driveFileId: string
  ): Observable<void> {
    const key = `${mountainId}:${imageName}`;

    if (blob.size > this.MAX_SIZE_PER_IMAGE) {
      return throwError(
        () => new Error(`Image too large: ${blob.size} bytes (max: ${this.MAX_SIZE_PER_IMAGE})`)
      );
    }

    return from(this.ensureDB()).pipe(
      switchMap(() => this.evictIfNeeded()),
      switchMap(() => {
        const cachedImage: CachedImage = {
          id: key,
          mountainId,
          imageName,
          blob,
          mimeType: blob.type,
          size: blob.size,
          lastAccessed: new Date(),
          downloadDate: new Date(),
          driveFileId,
        };

        return from(
          IndexedDBUtils.wrapOperation(() => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            return store.put(cachedImage);
          }).then(() => void 0)
        );
      }),
      catchError(RxJSUtils.logAndRethrow('Error storing image'))
    );
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): Observable<CacheStats> {
    return from(this.ensureDB()).pipe(
      switchMap(() => {
        return from(
          IndexedDBUtils.wrapOperation(() => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);
            return store.getAll();
          }).then((images: CachedImage[]) => {
            const totalSize = images.reduce((sum, img) => sum + img.size, 0);
            return {
              totalImages: images.length,
              totalSize,
              availableSlots: this.MAX_IMAGES - images.length,
            };
          })
        );
      }),
      catchError(RxJSUtils.logAndRethrow('Error getting cache stats'))
    );
  }

  /**
   * Clear all cached images
   */
  clearCache(): Observable<void> {
    return from(this.ensureDB()).pipe(
      switchMap(() => {
        return from(
          IndexedDBUtils.wrapOperation(() => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            return store.clear();
          })
        );
      }),
      catchError(RxJSUtils.logAndRethrow('Error clearing cache'))
    );
  }

  private async ensureDB(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  private evictIfNeeded(): Observable<void> {
    return from(
      new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const index = store.index('lastAccessed');
        const request = index.openCursor();

        let imageCount = 0;

        request.onsuccess = event => {
          const cursor = (event.target as IDBRequest).result;

          if (cursor) {
            imageCount++;
            cursor.continue();
          } else {
            // If we have reached the limit, delete oldest images
            if (imageCount >= this.MAX_IMAGES) {
              const deleteCount = imageCount - this.MAX_IMAGES + 1; // +1 to make room for new image

              // Get oldest images to delete
              const oldestRequest = index.openCursor();
              let deletedCount = 0;

              oldestRequest.onsuccess = deleteEvent => {
                const deleteCursor = (deleteEvent.target as IDBRequest).result;

                if (deleteCursor && deletedCount < deleteCount) {
                  store.delete(deleteCursor.primaryKey);
                  deletedCount++;
                  deleteCursor.continue();
                } else {
                  resolve();
                }
              };

              oldestRequest.onerror = () => reject(oldestRequest.error);
            } else {
              resolve();
            }
          }
        };

        request.onerror = () => reject(request.error);
      })
    );
  }
}
