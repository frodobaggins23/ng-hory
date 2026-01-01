import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Utility functions for common RxJS patterns
 */
export class RxJSUtils {
  /**
   * Simple error logging that re-throws the error
   */
  static logAndRethrow(errorMessage: string): (error: unknown) => Observable<never> {
    return (error: unknown) => {
      console.error(errorMessage, error);
      return throwError(() => error);
    };
  }

  /**
   * Removes item from Map after operation completes or errors
   */
  static cleanupMapEntry<K, V, T>(
    map: Map<K, V>,
    key: K
  ): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) =>
      source.pipe(
        tap({
          complete: () => map.delete(key),
          error: () => map.delete(key),
        })
      );
  }
}
