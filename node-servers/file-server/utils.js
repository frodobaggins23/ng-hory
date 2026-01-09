import path from 'path';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import mime from 'mime-types';

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
 * Validates if an origin is allowed for CORS.
 * Allows localhost (any port), kubac.website, and requests with no origin.
 *
 * @param {string|undefined} origin - The origin to validate
 * @returns {boolean} - True if the origin is allowed, false otherwise
 *
 * @example
 * isOriginAllowed('http://localhost:4200') // returns true
 * isOriginAllowed('http://kubac.website') // returns true
 * isOriginAllowed('http://evil.com') // returns false
 * isOriginAllowed(undefined) // returns true (no origin)
 */
export const isOriginAllowed = origin => {
  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) return true;

  // Define allowed origins
  const allowedOrigins = [
    /^http:\/\/localhost(:\d+)?$/, // localhost with any port
    /^http:\/\/127\.0\.0\.1(:\d+)?$/, // 127.0.0.1 with any port
    'http://kubac.website',
    'https://kubac.website',
  ];

  // Check if origin matches any allowed pattern
  return allowedOrigins.some(allowed => {
    if (typeof allowed === 'string') {
      return origin === allowed;
    }
    // RegExp pattern
    return allowed.test(origin);
  });
};

/**
 * Creates CORS options configuration for Express.
 * Uses isOriginAllowed to validate origins.
 *
 * @returns {Object} - CORS options object for Express cors middleware
 *
 * @example
 * import cors from 'cors';
 * import { getCorsOptions } from './utils.js';
 * app.use(cors(getCorsOptions()));
 */
export const getCorsOptions = () => ({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

/**
 * Verifies a JWT token from the Authorization header.
 * Expects header format: "Bearer <token>"
 * Returns the decoded token payload if valid, null if invalid or missing.
 *
 * @param {Object} req - Express request object
 * @returns {boolean} - True if token is valid, false otherwise
 *
 * @example
 * const decoded = verifyToken(req);
 * if (decoded && decoded.status === 'unlocked') {
 *   // Token is valid and gallery is unlocked
 * }
 */
export const verifyToken = req => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'your-secret-key');
    return !!decoded;
  } catch {
    return false;
  }
};

/**
 * Serves a file as a response with appropriate headers.
 * Sets Content-Type, Content-Length, and Content-Disposition headers.
 *
 * @param {string} filePath - The absolute path to the file
 * @param {string} filename - The filename to use in the response
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 *
 * @example
 * await serveFile('/path/to/file.jpg', 'file.jpg', res);
 */
export const serveFile = async (filePath, filename, res) => {
  // Get file stats
  const stats = await fs.stat(filePath);

  // Determine content type
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';

  // Set headers
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', stats.size);
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  // Stream the file
  const fileStream = await fs.readFile(filePath);
  res.send(fileStream);
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
