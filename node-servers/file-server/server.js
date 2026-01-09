import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import {
  sanitizePathComponent,
  isPathWithinDirectory,
  listFilesByDirectory,
  getCorsOptions,
  verifyToken,
  serveFile,
} from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(getCorsOptions()));

app.use(express.json());

const FILES_DIR = path.join(__dirname, 'file-storage');

app.get('/api/get-file', async (req, res) => {
  try {
    const tokenValid = verifyToken(req);

    if (!tokenValid) {
      const lockedFilePath = path.join(FILES_DIR, 'locked-gallery.webp');
      try {
        await fs.access(lockedFilePath);
        await serveFile(lockedFilePath, 'locked-gallery.webp', res);
        return;
      } catch {
        return res.status(404).json({ error: 'Locked gallery image not found' });
      }
    }

    const { folder, filename } = req.query;

    if (!filename) {
      return res.status(400).json({ error: 'Missing required parameter: filename' });
    }

    const safeFolder = folder ? sanitizePathComponent(folder) : null;
    const safeFilename = sanitizePathComponent(filename);

    if (!safeFilename) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    if (folder && !safeFolder) {
      return res.status(400).json({ error: 'Invalid folder' });
    }

    const filePath = safeFolder
      ? path.join(FILES_DIR, safeFolder, safeFilename)
      : path.join(FILES_DIR, safeFilename);

    if (!isPathWithinDirectory(filePath, FILES_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }

    await serveFile(filePath, safeFilename, res);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/list-files', async (req, res) => {
  try {
    const result = await listFilesByDirectory(FILES_DIR);
    res.json(result);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

app.post('/api/unlock-gallery', (req, res) => {
  try {
    const { passphrase } = req.body;

    if (!passphrase) {
      return res.status(400).json({ error: 'Missing passphrase' });
    }

    if (passphrase !== process.env.PASSPHRASE) {
      return res.status(401).json({ error: 'Invalid passphrase' });
    }

    const token = jwt.sign(
      { status: 'unlocked' },

      process.env.JWT_SECRET_KEY || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error in unlock-gallery:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/verify-token', (req, res) => {
  {
    const tokenValid = verifyToken(req);
    res.json({ valid: tokenValid });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`File server running on port ${PORT}`);
  console.log(`Files directory: ${FILES_DIR}`);
  console.log(`Example: http://localhost:${PORT}/api/get-file?folder=bezdez&filename=bezdez01.jpg`);
  console.log(`Root file example: http://localhost:${PORT}/api/get-file?filename=file.txt`);
});
