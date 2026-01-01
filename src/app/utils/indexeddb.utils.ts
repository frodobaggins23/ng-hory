/**
 * Utility functions for IndexedDB operations
 */
export class IndexedDBUtils {
  /**
   * Wraps an IndexedDB operation in a Promise
   */
  static wrapOperation<T>(operation: () => IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const request = operation();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
