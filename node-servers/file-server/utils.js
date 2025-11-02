import path from 'path';
import fs from 'fs/promises';

/**
 * Sanitizes a path component to prevent path traversal attacks.
 * Removes path separators, dangerous components (., ..), and returns only the first valid part.
 *
 * @param {string} component - The path component to sanitize
 * @returns {string} - The sanitized component, or empty string if invalid
 *
 * @example
 * sanitizePathComponent('../../../etc') // returns ''
 * sanitizePathComponent('bezdez') // returns 'bezdez'
 * sanitizePathComponent('folder/subfolder') // returns 'folder'
 * sanitizePathComponent('/folder/') // returns 'folder'
 */
export const sanitizePathComponent = component => {
  if (typeof component !== 'string') return '';

  // Handle null bytes (null byte injection protection)
  // Truncate at first null byte - they're often used to bypass file extension checks
  // or inject malicious paths
  const nullByteIndex = component.indexOf('\x00');
  let sanitized = nullByteIndex >= 0 ? component.substring(0, nullByteIndex) : component;

  // Decode URL encoding (defensive measure - Express usually handles this, but be safe)
  try {
    sanitized = decodeURIComponent(sanitized);
  } catch {
    // If decoding fails, continue with original string
  }

  // Remove leading/trailing slashes and whitespace
  sanitized = sanitized.trim().replace(/^\/+|\/+$/g, '');

  // Split by any path separator
  const allParts = sanitized.split(/[/\\]/);

  // Filter out traversal attempts and empty parts
  const parts = allParts.filter(part => {
    return part && part !== '.' && part !== '..' && !part.startsWith('..');
  });

  // Return only the first valid part (prevents nested paths in a single component)
  return parts[0] || '';
};

/**
 * Verifies that a file path is within the allowed base directory.
 * Prevents path traversal attacks by checking if the resolved path starts with the base directory.
 *
 * @param {string} filePath - The file path to verify
 * @param {string} baseDir - The base directory that must contain the file path
 * @returns {boolean} - True if the file path is within the base directory, false otherwise
 *
 * @example
 * isPathWithinDirectory('/safe/dir/file.txt', '/safe/dir') // returns true
 * isPathWithinDirectory('/safe/dir/../etc/passwd', '/safe/dir') // returns false
 */
export const isPathWithinDirectory = (filePath, baseDir) => {
  const resolvedPath = path.resolve(filePath);
  const resolvedBaseDir = path.resolve(baseDir);
  return resolvedPath.startsWith(resolvedBaseDir);
};

/**
 * Lists files organized by directories.
 * Returns an array of objects where each object represents a directory and its files.
 * Root level files are included with the key 'root'.
 *
 * @param {string} filesDir - The directory to list files from
 * @returns {Promise<Array>} - Array of objects with directory names as keys and file arrays as values
 *
 * @example
 * listFilesByDirectory('/path/to/files')
 * // returns [
 * //   { root: ['file1.txt', 'file2.txt'] },
 * //   { dir1: ['file1.jpg', 'file2.jpg'] },
 * //   { dir2: ['file3.png'] }
 * // ]
 */
export const listFilesByDirectory = async filesDir => {
  const result = [];

  // Read root directory
  const rootEntries = await fs.readdir(filesDir, { withFileTypes: true });
  const rootFiles = [];

  for (const entry of rootEntries) {
    if (entry.isFile()) {
      rootFiles.push(entry.name);
    } else if (entry.isDirectory()) {
      // Read directory and add to result
      const dirPath = path.join(filesDir, entry.name);
      const dirFiles = await fs.readdir(dirPath);
      result.push({ [entry.name]: dirFiles });
    }
  }

  // Add root files if any exist
  if (rootFiles.length > 0) {
    result.unshift({ root: rootFiles });
  }

  return result;
};
