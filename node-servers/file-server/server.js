import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import mime from 'mime-types';
import {
  sanitizePathComponent,
  isPathWithinDirectory,
  listFilesByDirectory,
  getCorsOptions,
} from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow requests from localhost and kubac.website
app.use(cors(getCorsOptions()));

// Directory where protected files are stored (outside public web root)
const FILES_DIR = path.join(__dirname, 'file-storage');

// API endpoint to get files (structure: /file-storage/folder/filename or /file-storage/filename)
app.get('/api/get-file', async (req, res) => {
  try {
    // Get query parameters
    const { folder, filename } = req.query;

    // Validate required parameters
    if (!filename) {
      return res.status(400).json({ error: 'Missing required parameter: filename' });
    }

    // Security Layer 1: Sanitize folder and filename separately
    const safeFolder = folder ? sanitizePathComponent(folder) : null;
    const safeFilename = sanitizePathComponent(filename);

    // Validate sanitized filename is not empty
    if (!safeFilename) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    if (folder && !safeFolder) {
      return res.status(400).json({ error: 'Invalid folder' });
    }

    // Construct path: /file-storage/folder/filename or /file-storage/filename
    const filePath = safeFolder
      ? path.join(FILES_DIR, safeFolder, safeFilename)
      : path.join(FILES_DIR, safeFilename);

    // Security Layer 2: Verify file is within allowed directory (double-check security)
    if (!isPathWithinDirectory(filePath, FILES_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get file stats
    const stats = await fs.stat(filePath);

    // Determine content type
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    // Set headers
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);

    // Stream the file
    const fileStream = await fs.readFile(filePath);
    res.send(fileStream);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Optional: List available files (for development)
app.get('/api/list-files', async (req, res) => {
  try {
    const result = await listFilesByDirectory(FILES_DIR);
    res.json(result);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`File server running on port ${PORT}`);
  console.log(`Files directory: ${FILES_DIR}`);
  console.log(`Example: http://localhost:${PORT}/api/get-file?folder=bezdez&filename=bezdez01.jpg`);
  console.log(`Root file example: http://localhost:${PORT}/api/get-file?filename=file.txt`);
});
