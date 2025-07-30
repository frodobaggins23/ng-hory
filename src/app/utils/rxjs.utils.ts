import { Observable, throwError, of } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Utility functions for common RxJS patterns
 */
export class RxJSUtils {
  /**
   * Standardized error handling with optional fallback value
   */
  static handleError<T>(errorMessage: string, fallbackValue?: T): (error: any) => Observable<T> {
    return (error: any) => {
      console.error(errorMessage, error);

      if (fallbackValue !== undefined) {
        return of(fallbackValue);
      }

      return throwError(() => error);
    };
  }

  /**
   * Simple error logging that re-throws the error
   */
  static logAndRethrow(errorMessage: string): (error: any) => Observable<never> {
    return (error: any) => {
      console.error(errorMessage, error);
      return throwError(() => error);
    };
  }

  /**
   * Removes item from Map after operation completes or errors
   */
  static cleanupMapEntry<K, V>(
    map: Map<K, V>,
    key: K
  ): (source: Observable<any>) => Observable<any> {
    return (source: Observable<any>) =>
      source.pipe(
        tap({
          complete: () => map.delete(key),
          error: () => map.delete(key),
        })
      );
  }

  /**
   * Logs performance timing for operations
   */
  static measurePerformance<T>(operationName: string): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => {
      const startTime = performance.now();

      return source.pipe(
        tap({
          next: () => {
            const duration = performance.now() - startTime;
            console.log(`📊 ${operationName}: ${duration.toFixed(2)}ms`);
          },
        })
      );
    };
  }
}
