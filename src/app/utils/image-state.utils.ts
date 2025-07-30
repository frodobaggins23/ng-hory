import { BehaviorSubject } from 'rxjs';
import { ImageLoadResult } from '../services/image.service';

/**
 * Common interface for image state across components
 */
export interface ImageState {
  url: string | null;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

/**
 * Utility functions for managing image state
 */
export class ImageStateUtils {
  /**
   * Creates initial empty image state
   */
  static createInitialState(): ImageState {
    return {
      url: null,
      loading: false,
      error: null,
      fromCache: false,
    };
  }

  /**
   * Creates loading state
   */
  static createLoadingState(): ImageState {
    return {
      url: null,
      loading: true,
      error: null,
      fromCache: false,
    };
  }

  /**
   * Creates success state from ImageLoadResult
   */
  static createSuccessState(result: ImageLoadResult): ImageState {
    return {
      url: result.url,
      loading: false,
      error: null,
      fromCache: result.fromCache,
    };
  }

  /**
   * Creates error state
   */
  static createErrorState(error: string): ImageState {
    return {
      url: null,
      loading: false,
      error,
      fromCache: false,
    };
  }

  /**
   * Updates a BehaviorSubject with loading state
   */
  static setLoading(subject: BehaviorSubject<ImageState>): void {
    subject.next(this.createLoadingState());
  }

  /**
   * Updates a BehaviorSubject with success state
   */
  static setSuccess(subject: BehaviorSubject<ImageState>, result: ImageLoadResult): void {
    subject.next(this.createSuccessState(result));
  }

  /**
   * Updates a BehaviorSubject with error state
   */
  static setError(subject: BehaviorSubject<ImageState>, error: string): void {
    subject.next(this.createErrorState(error));
  }
}
