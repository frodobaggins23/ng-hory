/**
 * Utility functions for mountain-related operations
 */
export class MountainUtils {
  /**
   * Normalizes a mountain name to a consistent ID format
   */
  static normalizeMountainName(mountainName: string): string {
    return mountainName.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Creates a composite key for caching (mountainId:imageName)
   */
  static createImageKey(mountainName: string, imageName: string): string {
    const mountainId = this.normalizeMountainName(mountainName);
    return `${mountainId}:${imageName}`;
  }

  /**
   * Parses a composite image key back to components
   */
  static parseImageKey(key: string): { mountainId: string; imageName: string } {
    const [mountainId, ...imageNameParts] = key.split(':');
    return {
      mountainId,
      imageName: imageNameParts.join(':') // Handle image names with colons
    };
  }
}