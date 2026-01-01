/**
 * Utility functions for blob URL management
 */
export class BlobUtils {
  /**
   * Creates a blob URL from a blob
   */
  static createBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
}
