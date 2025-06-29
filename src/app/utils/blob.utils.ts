/**
 * Utility functions for blob URL management
 */
export class BlobUtils {
  /**
   * Revokes a blob URL if it's a valid blob URL
   */
  static revokeBlobUrl(url: string | null): void {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Revokes multiple blob URLs from a collection
   */
  static revokeBlobUrls(urls: (string | null)[]): void {
    urls.forEach(url => this.revokeBlobUrl(url));
  }

  /**
   * Revokes blob URLs from a Map of states/objects containing url property
   */
  static revokeBlobUrlsFromMap<T extends { url?: string | null }>(map: Map<any, T>): void {
    map.forEach(item => {
      if (item.url) {
        this.revokeBlobUrl(item.url);
      }
    });
  }

  /**
   * Creates a blob URL from a blob
   */
  static createBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
}