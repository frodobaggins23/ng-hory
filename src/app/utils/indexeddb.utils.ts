import { Observable, from } from 'rxjs';

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

  /**
   * Wraps an IndexedDB transaction in a Promise
   */
  static wrapTransaction(
    db: IDBDatabase,
    storeNames: string | string[],
    mode: IDBTransactionMode,
    operation: (transaction: IDBTransaction, store: IDBObjectStore) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeNames, mode);
      const store = transaction.objectStore(Array.isArray(storeNames) ? storeNames[0] : storeNames);
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      
      try {
        operation(transaction, store);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Converts IndexedDB Promise to Observable
   */
  static toObservable<T>(operation: () => Promise<T>): Observable<T> {
    return from(operation());
  }
}