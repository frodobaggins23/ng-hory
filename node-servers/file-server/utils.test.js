import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import path from 'path';
import fs from 'fs/promises';
import { tmpdir } from 'os';
import jwt from 'jsonwebtoken';
import {
  sanitizePathComponent,
  isPathWithinDirectory,
  listFilesByDirectory,
  isOriginAllowed,
  getCorsOptions,
  verifyToken,
  verifyAdminToken,
  serveFile,
} from './utils.js';

test('sanitizePathComponent - basic valid inputs', () => {
  assert.strictEqual(sanitizePathComponent('bezdez'), 'bezdez');
  assert.strictEqual(sanitizePathComponent('example'), 'example');
  assert.strictEqual(sanitizePathComponent('file123'), 'file123');
  assert.strictEqual(sanitizePathComponent('my-folder'), 'my-folder');
  assert.strictEqual(sanitizePathComponent('file.name'), 'file.name');
});

test('sanitizePathComponent - path traversal attacks: basic .. attempts', () => {
  assert.strictEqual(sanitizePathComponent('..'), '');
  assert.strictEqual(sanitizePathComponent('../'), '');
  assert.strictEqual(sanitizePathComponent('/../'), '');
  assert.strictEqual(sanitizePathComponent('../..'), '');
  assert.strictEqual(sanitizePathComponent('../../../'), '');
});

test('sanitizePathComponent - path traversal attacks: .. with legitimate parts', () => {
  assert.strictEqual(sanitizePathComponent('../bezdez'), 'bezdez');
  assert.strictEqual(sanitizePathComponent('bezdez/../etc'), 'bezdez');
  assert.strictEqual(sanitizePathComponent('../../etc/passwd'), 'etc');
  assert.strictEqual(sanitizePathComponent('folder/../../etc'), 'folder');
});

test('sanitizePathComponent - path traversal attacks: current directory . attempts', () => {
  assert.strictEqual(sanitizePathComponent('.'), '');
  assert.strictEqual(sanitizePathComponent('./'), '');
  assert.strictEqual(sanitizePathComponent('././.'), '');
  assert.strictEqual(sanitizePathComponent('./etc'), 'etc');
  assert.strictEqual(sanitizePathComponent('.hidden'), '.hidden');
});

test('sanitizePathComponent - path traversal attacks: mixed dangerous components', () => {
  assert.strictEqual(sanitizePathComponent('.././../etc'), 'etc');
  assert.strictEqual(sanitizePathComponent('./../..'), '');
  assert.strictEqual(sanitizePathComponent('..//etc'), 'etc');
  assert.strictEqual(sanitizePathComponent('.//..'), '');
});

test('sanitizePathComponent - path traversal attacks: Windows-style separators', () => {
  assert.strictEqual(sanitizePathComponent('..\\..\\etc'), 'etc');
  assert.strictEqual(sanitizePathComponent('folder\\..\\..'), 'folder');
  assert.strictEqual(sanitizePathComponent('..\\..\\..\\windows\\system32'), 'windows');
  assert.strictEqual(sanitizePathComponent('..\\..'), '');
});

test('sanitizePathComponent - path traversal attacks: nested paths in single component', () => {
  assert.strictEqual(sanitizePathComponent('folder/subfolder'), 'folder');
  assert.strictEqual(sanitizePathComponent('bezdez/file.jpg'), 'bezdez');
  assert.strictEqual(sanitizePathComponent('dir1/dir2/dir3'), 'dir1');
  assert.strictEqual(sanitizePathComponent('a/b/c/d/e'), 'a');
});

test('sanitizePathComponent - path traversal attacks: leading/trailing slashes', () => {
  assert.strictEqual(sanitizePathComponent('/bezdez'), 'bezdez');
  assert.strictEqual(sanitizePathComponent('bezdez/'), 'bezdez');
  assert.strictEqual(sanitizePathComponent('/bezdez/'), 'bezdez');
  assert.strictEqual(sanitizePathComponent('//bezdez//'), 'bezdez');
});

test('sanitizePathComponent - path traversal attacks: URL encoded attempts', () => {
  // Note: Express decodes URL encoding before reaching this function
  // These represent what might come through if encoding was attempted
  assert.strictEqual(sanitizePathComponent('%2E%2E'), '');
  assert.strictEqual(sanitizePathComponent('%2E%2E%2Fetc'), 'etc');
});

test('sanitizePathComponent - path traversal attacks: null byte injection attempts', () => {
  // Null bytes truncate the string - prevents extension bypass and path injection
  assert.strictEqual(sanitizePathComponent('bezdez\x00/etc'), 'bezdez');
  assert.strictEqual(sanitizePathComponent('\x00../etc'), '');
});

test('sanitizePathComponent - edge cases', () => {
  assert.strictEqual(sanitizePathComponent(''), '');
  assert.strictEqual(sanitizePathComponent('   '), '');
  assert.strictEqual(sanitizePathComponent('/'), '');
  assert.strictEqual(sanitizePathComponent('//'), '');
  assert.strictEqual(sanitizePathComponent(null), '');
  assert.strictEqual(sanitizePathComponent(undefined), '');
  assert.strictEqual(sanitizePathComponent(123), '');
  assert.strictEqual(sanitizePathComponent({}), '');
  assert.strictEqual(sanitizePathComponent([]), '');
});

test('sanitizePathComponent - whitespace handling', () => {
  assert.strictEqual(sanitizePathComponent('  bezdez  '), 'bezdez');
  assert.strictEqual(sanitizePathComponent('\tbezdez\n'), 'bezdez');
  assert.strictEqual(sanitizePathComponent('  ../etc  '), 'etc');
});

test('isPathWithinDirectory - valid paths within directory', () => {
  const baseDir = '/home/user/file-storage';

  assert.strictEqual(
    isPathWithinDirectory(path.join(baseDir, 'bezdez', 'file.jpg'), baseDir),
    true
  );

  assert.strictEqual(
    isPathWithinDirectory(path.join(baseDir, 'folder', 'subfolder', 'file.txt'), baseDir),
    true
  );

  assert.strictEqual(isPathWithinDirectory(baseDir, baseDir), true);
});

test('isPathWithinDirectory - path traversal attacks: basic .. attempts', () => {
  const baseDir = '/home/user/file-storage';

  assert.strictEqual(
    isPathWithinDirectory(path.join(baseDir, '..', 'etc', 'passwd'), baseDir),
    false
  );

  assert.strictEqual(
    isPathWithinDirectory(path.join(baseDir, '..', '..', 'etc', 'passwd'), baseDir),
    false
  );

  assert.strictEqual(
    isPathWithinDirectory(path.join(baseDir, 'folder', '..', '..', 'etc'), baseDir),
    false
  );
});

test('isPathWithinDirectory - path traversal attacks: escaped directory', () => {
  const baseDir = '/home/user/file-storage';

  assert.strictEqual(isPathWithinDirectory('/etc/passwd', baseDir), false);
  assert.strictEqual(isPathWithinDirectory('/home/user/.ssh/id_rsa', baseDir), false);
  assert.strictEqual(isPathWithinDirectory('C:\\Windows\\System32', baseDir), false);
});

test('isPathWithinDirectory - path traversal attacks: symlink-style attempts', () => {
  const baseDir = '/home/user/file-storage';

  // Even if path.resolve normalizes these, they should still be outside
  assert.strictEqual(
    isPathWithinDirectory(path.resolve(baseDir, '..', 'user', '.bashrc'), baseDir),
    false
  );
});

test('isPathWithinDirectory - edge cases', () => {
  const baseDir = '/home/user/file-storage';

  // Same directory
  assert.strictEqual(isPathWithinDirectory(baseDir, baseDir), true);

  // Parent directory (should be false)
  assert.strictEqual(isPathWithinDirectory(path.join(baseDir, '..'), baseDir), false);

  // Empty path (edge case)
  assert.strictEqual(isPathWithinDirectory('', baseDir), false);
});

test('isPathWithinDirectory - Windows paths', () => {
  const baseDir = 'C:\\Users\\user\\file-storage';

  assert.strictEqual(
    isPathWithinDirectory(path.join(baseDir, 'folder', 'file.txt'), baseDir),
    true
  );

  assert.strictEqual(
    isPathWithinDirectory(path.join(baseDir, '..', '..', 'Windows', 'System32'), baseDir),
    false
  );
});

test('isPathWithinDirectory - relative path attempts', () => {
  const baseDir = path.resolve('/home/user/file-storage');

  // These should resolve to absolute paths and be checked
  assert.strictEqual(isPathWithinDirectory(path.resolve('../../../etc/passwd'), baseDir), false);
});

test('Integration: sanitize + isPathWithinDirectory protection', () => {
  const baseDir = '/home/user/file-storage';

  // Simulate the server's protection flow
  const maliciousFolder = '../../../etc';
  const maliciousFilename = '../../passwd';

  const safeFolder = sanitizePathComponent(maliciousFolder);
  const safeFilename = sanitizePathComponent(maliciousFilename);

  // After sanitization, should be empty or safe
  assert.strictEqual(safeFolder, 'etc');
  assert.strictEqual(safeFilename, 'passwd');

  // Even if sanitization lets through 'etc' and 'passwd',
  // the path should still be within baseDir when constructed properly
  const filePath = path.join(baseDir, safeFolder, safeFilename);
  assert.strictEqual(isPathWithinDirectory(filePath, baseDir), true);

  // But direct traversal attempts should fail
  const traversalPath = path.join(baseDir, '..', 'etc', 'passwd');
  assert.strictEqual(isPathWithinDirectory(traversalPath, baseDir), false);
});

test('Real-world attack scenarios', () => {
  // Scenario 1: Classic directory traversal
  assert.strictEqual(sanitizePathComponent('../../../etc/passwd'), 'etc');

  // Scenario 2: Encoded path traversal (what Express might pass after decoding)
  // After decoding becomes '../../etc', filters to 'etc'
  assert.strictEqual(sanitizePathComponent('..%2F..%2Fetc'), 'etc');

  // Scenario 3: Null byte injection
  assert.strictEqual(sanitizePathComponent('file.txt\x00.jpg'), 'file.txt');

  // Scenario 4: Mixed separators
  assert.strictEqual(sanitizePathComponent('folder\\..\\../etc'), 'folder');

  // Scenario 5: Nested in component (should only return first part)
  assert.strictEqual(sanitizePathComponent('bezdez/../etc'), 'bezdez');

  const baseDir = '/app/files';
  // Scenario 6: Path that resolves outside base
  assert.strictEqual(
    isPathWithinDirectory(path.join(baseDir, '..', 'config', 'secrets'), baseDir),
    false
  );
});

test('listFilesByDirectory - basic functionality with directories', async () => {
  // Create a temporary directory structure
  const testDir = path.join(tmpdir(), `file-server-test-${Date.now()}-${Math.random()}`);
  await fs.mkdir(testDir, { recursive: true });

  try {
    // Create subdirectories with files
    const dir1 = path.join(testDir, 'dir1');
    const dir2 = path.join(testDir, 'dir2');
    await fs.mkdir(dir1, { recursive: true });
    await fs.mkdir(dir2, { recursive: true });

    // Create files in directories
    await fs.writeFile(path.join(dir1, 'file1.txt'), 'content');
    await fs.writeFile(path.join(dir1, 'file2.jpg'), 'content');
    await fs.writeFile(path.join(dir2, 'file3.png'), 'content');

    const result = await listFilesByDirectory(testDir);

    // Should have 2 directories
    assert.strictEqual(result.length, 2);

    // Check that both directories are present
    const dir1Data = result.find(item => 'dir1' in item);
    const dir2Data = result.find(item => 'dir2' in item);

    assert.ok(dir1Data);
    assert.ok(dir2Data);

    // Check files in dir1
    assert.strictEqual(dir1Data.dir1.length, 2);
    assert.ok(dir1Data.dir1.includes('file1.txt'));
    assert.ok(dir1Data.dir1.includes('file2.jpg'));

    // Check files in dir2
    assert.strictEqual(dir2Data.dir2.length, 1);
    assert.ok(dir2Data.dir2.includes('file3.png'));
  } finally {
    // Cleanup
    await fs.rm(testDir, { recursive: true, force: true });
  }
});

test('listFilesByDirectory - with root files', async () => {
  const testDir = path.join(tmpdir(), `file-server-test-${Date.now()}-${Math.random()}`);
  await fs.mkdir(testDir, { recursive: true });

  try {
    // Create root level files
    await fs.writeFile(path.join(testDir, 'rootfile1.txt'), 'content');
    await fs.writeFile(path.join(testDir, 'rootfile2.jpg'), 'content');

    // Create a subdirectory with files
    const subdir = path.join(testDir, 'subdir');
    await fs.mkdir(subdir, { recursive: true });
    await fs.writeFile(path.join(subdir, 'subfile.txt'), 'content');

    const result = await listFilesByDirectory(testDir);

    // Should have root first, then subdir
    assert.strictEqual(result.length, 2);

    // First item should be root
    assert.ok('root' in result[0]);
    assert.strictEqual(result[0].root.length, 2);
    assert.ok(result[0].root.includes('rootfile1.txt'));
    assert.ok(result[0].root.includes('rootfile2.jpg'));

    // Second item should be subdir
    assert.ok('subdir' in result[1]);
    assert.strictEqual(result[1].subdir.length, 1);
    assert.ok(result[1].subdir.includes('subfile.txt'));
  } finally {
    await fs.rm(testDir, { recursive: true, force: true });
  }
});

test('listFilesByDirectory - only root files', async () => {
  const testDir = path.join(tmpdir(), `file-server-test-${Date.now()}-${Math.random()}`);
  await fs.mkdir(testDir, { recursive: true });

  try {
    // Create only root level files
    await fs.writeFile(path.join(testDir, 'file1.txt'), 'content');
    await fs.writeFile(path.join(testDir, 'file2.txt'), 'content');

    const result = await listFilesByDirectory(testDir);

    // Should have only root
    assert.strictEqual(result.length, 1);
    assert.ok('root' in result[0]);
    assert.strictEqual(result[0].root.length, 2);
  } finally {
    await fs.rm(testDir, { recursive: true, force: true });
  }
});

test('listFilesByDirectory - only directories, no root files', async () => {
  const testDir = path.join(tmpdir(), `file-server-test-${Date.now()}-${Math.random()}`);
  await fs.mkdir(testDir, { recursive: true });

  try {
    // Create only subdirectories
    const dir1 = path.join(testDir, 'dir1');
    const dir2 = path.join(testDir, 'dir2');
    await fs.mkdir(dir1, { recursive: true });
    await fs.mkdir(dir2, { recursive: true });

    await fs.writeFile(path.join(dir1, 'file.txt'), 'content');
    await fs.writeFile(path.join(dir2, 'file.txt'), 'content');

    const result = await listFilesByDirectory(testDir);

    // Should have 2 directories, no root
    assert.strictEqual(result.length, 2);
    assert.ok(!result.some(item => 'root' in item));
  } finally {
    await fs.rm(testDir, { recursive: true, force: true });
  }
});

test('listFilesByDirectory - empty directory', async () => {
  const testDir = path.join(tmpdir(), `file-server-test-${Date.now()}-${Math.random()}`);
  await fs.mkdir(testDir, { recursive: true });

  try {
    const result = await listFilesByDirectory(testDir);

    // Should return empty array
    assert.strictEqual(result.length, 0);
  } finally {
    await fs.rm(testDir, { recursive: true, force: true });
  }
});

test('listFilesByDirectory - multiple files per directory', async () => {
  const testDir = path.join(tmpdir(), `file-server-test-${Date.now()}-${Math.random()}`);
  await fs.mkdir(testDir, { recursive: true });

  try {
    const dir1 = path.join(testDir, 'dir1');
    await fs.mkdir(dir1, { recursive: true });

    // Create 10 files in dir1
    for (let i = 1; i <= 10; i++) {
      await fs.writeFile(path.join(dir1, `file${i}.txt`), 'content');
    }

    const result = await listFilesByDirectory(testDir);

    assert.strictEqual(result.length, 1);
    assert.ok('dir1' in result[0]);
    assert.strictEqual(result[0].dir1.length, 10);
  } finally {
    await fs.rm(testDir, { recursive: true, force: true });
  }
});

test('listFilesByDirectory - error handling: non-existent directory', async () => {
  const nonExistentDir = path.join(
    tmpdir(),
    `file-server-test-nonexistent-${Date.now()}-${Math.random()}`
  );

  await assert.rejects(async () => await listFilesByDirectory(nonExistentDir), { code: 'ENOENT' });
});

// ============================================================================
// CORS Tests
// ============================================================================

test('isOriginAllowed - localhost origins: default port', () => {
  assert.strictEqual(isOriginAllowed('http://localhost'), true);
  assert.strictEqual(isOriginAllowed('http://127.0.0.1'), true);
});

test('isOriginAllowed - localhost origins: with port numbers', () => {
  assert.strictEqual(isOriginAllowed('http://localhost:4200'), true);
  assert.strictEqual(isOriginAllowed('http://localhost:3000'), true);
  assert.strictEqual(isOriginAllowed('http://localhost:8080'), true);
  assert.strictEqual(isOriginAllowed('http://127.0.0.1:4200'), true);
  assert.strictEqual(isOriginAllowed('http://127.0.0.1:3000'), true);
  assert.strictEqual(isOriginAllowed('http://127.0.0.1:8080'), true);
});

test('isOriginAllowed - kubac.website origins: http and https', () => {
  assert.strictEqual(isOriginAllowed('http://kubac.website'), true);
  assert.strictEqual(isOriginAllowed('https://kubac.website'), true);
});

test('isOriginAllowed - no origin: undefined, null, empty string', () => {
  assert.strictEqual(isOriginAllowed(undefined), true);
  assert.strictEqual(isOriginAllowed(null), true);
  assert.strictEqual(isOriginAllowed(''), true);
});

test('isOriginAllowed - rejected origins: other domains', () => {
  assert.strictEqual(isOriginAllowed('http://evil.com'), false);
  assert.strictEqual(isOriginAllowed('https://evil.com'), false);
  assert.strictEqual(isOriginAllowed('http://malicious.site'), false);
  assert.strictEqual(isOriginAllowed('https://attacker.net'), false);
});

test('isOriginAllowed - rejected origins: localhost with https', () => {
  assert.strictEqual(isOriginAllowed('https://localhost'), false);
  assert.strictEqual(isOriginAllowed('https://localhost:4200'), false);
  assert.strictEqual(isOriginAllowed('https://127.0.0.1'), false);
});

test('isOriginAllowed - rejected origins: subdomain variations', () => {
  assert.strictEqual(isOriginAllowed('http://api.kubac.website'), false);
  assert.strictEqual(isOriginAllowed('http://www.kubac.website'), false);
  assert.strictEqual(isOriginAllowed('http://subdomain.kubac.website'), false);
});

test('isOriginAllowed - rejected origins: kubac.website with port', () => {
  assert.strictEqual(isOriginAllowed('http://kubac.website:8080'), false);
  assert.strictEqual(isOriginAllowed('https://kubac.website:443'), false);
});

test('isOriginAllowed - rejected origins: path traversal attempts', () => {
  assert.strictEqual(isOriginAllowed('http://localhost/../evil.com'), false);
  assert.strictEqual(isOriginAllowed('http://kubac.website/../../evil'), false);
});

test('isOriginAllowed - rejected origins: localhost variations', () => {
  assert.strictEqual(isOriginAllowed('http://localhost.evil.com'), false);
  assert.strictEqual(isOriginAllowed('http://127.0.0.1.evil.com'), false);
  assert.strictEqual(isOriginAllowed('http://127.0.0.2'), false);
  assert.strictEqual(isOriginAllowed('http://192.168.1.1'), false);
});

test('getCorsOptions - returns correct structure', () => {
  const options = getCorsOptions();

  assert.strictEqual(typeof options, 'object');
  assert.strictEqual(typeof options.origin, 'function');
  assert.strictEqual(options.credentials, true);
});

test('getCorsOptions - origin callback: allows valid origins', () => {
  const options = getCorsOptions();
  const validOrigins = [
    'http://localhost:4200',
    'http://127.0.0.1:3000',
    'http://kubac.website',
    'https://kubac.website',
    undefined,
  ];

  validOrigins.forEach(origin => {
    let callbackCalled = false;
    let callbackError = null;
    let callbackResult = null;

    options.origin(origin, (err, result) => {
      callbackCalled = true;
      callbackError = err;
      callbackResult = result;
    });

    assert.strictEqual(callbackCalled, true, `Callback should be called for origin: ${origin}`);
    assert.strictEqual(callbackError, null, `No error expected for origin: ${origin}`);
    assert.strictEqual(callbackResult, true, `Origin should be allowed: ${origin}`);
  });
});

test('getCorsOptions - origin callback: rejects invalid origins', () => {
  const options = getCorsOptions();
  const invalidOrigins = [
    'http://evil.com',
    'https://malicious.site',
    'http://api.kubac.website',
    'https://localhost',
  ];

  invalidOrigins.forEach(origin => {
    let callbackCalled = false;
    let callbackError = null;

    options.origin(origin, err => {
      callbackCalled = true;
      callbackError = err;
    });

    assert.strictEqual(callbackCalled, true, `Callback should be called for origin: ${origin}`);
    assert.ok(callbackError instanceof Error, `Error expected for origin: ${origin}`);
    assert.strictEqual(callbackError.message, 'Not allowed by CORS');
  });
});

// ============================================================================
// Token Verification Tests
// ============================================================================

test('verifyToken - valid token with Bearer prefix', () => {
  const secret = 'test-secret-key';
  const token = jwt.sign({ status: 'unlocked' }, secret);
  const req = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  // Mock process.env for this test
  const originalEnv = process.env.JWT_SECRET_KEY;
  process.env.JWT_SECRET_KEY = secret;

  const decoded = verifyToken(req);
  assert.strictEqual(decoded, true);

  process.env.JWT_SECRET_KEY = originalEnv;
});

test('verifyToken - missing authorization header', () => {
  const req = {
    headers: {},
  };

  const decoded = verifyToken(req);
  assert.strictEqual(decoded, null);
});

test('verifyToken - missing Bearer prefix', () => {
  const secret = 'test-secret-key';
  const token = jwt.sign({ status: 'unlocked' }, secret);
  const req = {
    headers: {
      authorization: token,
    },
  };

  const decoded = verifyToken(req);
  assert.strictEqual(decoded, null);
});

test('verifyToken - invalid token signature', () => {
  const req = {
    headers: {
      authorization: 'Bearer invalid.token.here',
    },
  };

  const decoded = verifyToken(req);
  assert.strictEqual(decoded, false);
});

test('verifyToken - expired token', () => {
  const secret = 'test-secret-key';
  const token = jwt.sign({ status: 'unlocked' }, secret, { expiresIn: '-1h' });
  const req = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const originalEnv = process.env.JWT_SECRET_KEY;
  process.env.JWT_SECRET_KEY = secret;

  const decoded = verifyToken(req);
  assert.strictEqual(decoded, false);

  process.env.JWT_SECRET_KEY = originalEnv;
});

test('verifyToken - wrong secret key', () => {
  const secret1 = 'secret-key-1';
  const secret2 = 'secret-key-2';
  const token = jwt.sign({ status: 'unlocked' }, secret1);
  const req = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const originalEnv = process.env.JWT_SECRET_KEY;
  process.env.JWT_SECRET_KEY = secret2;

  const decoded = verifyToken(req);
  assert.strictEqual(decoded, false);

  process.env.JWT_SECRET_KEY = originalEnv;
});

// ============================================================================
// Admin Token Verification Tests
// ============================================================================

describe('verifyAdminToken', () => {
  let originalAdminToken;

  beforeEach(() => {
    originalAdminToken = process.env.ADMIN_TOKEN;
  });

  afterEach(() => {
    if (originalAdminToken === undefined) {
      delete process.env.ADMIN_TOKEN;
    } else {
      process.env.ADMIN_TOKEN = originalAdminToken;
    }
  });

  test('valid token with Bearer prefix', () => {
    const adminToken = 'super-secret-admin-token';
    const req = { headers: { authorization: `Bearer ${adminToken}` } };
    process.env.ADMIN_TOKEN = adminToken;

    assert.strictEqual(verifyAdminToken(req), true);
  });

  test('missing authorization header', () => {
    const req = { headers: {} };
    process.env.ADMIN_TOKEN = 'super-secret-admin-token';

    assert.strictEqual(verifyAdminToken(req), false);
  });

  test('missing Bearer prefix', () => {
    const adminToken = 'super-secret-admin-token';
    const req = { headers: { authorization: adminToken } };
    process.env.ADMIN_TOKEN = adminToken;

    assert.strictEqual(verifyAdminToken(req), false);
  });

  test('wrong token', () => {
    const req = { headers: { authorization: 'Bearer wrong-token' } };
    process.env.ADMIN_TOKEN = 'super-secret-admin-token';

    assert.strictEqual(verifyAdminToken(req), false);
  });

  test('ADMIN_TOKEN not configured on server', () => {
    const req = { headers: { authorization: 'Bearer whatever' } };
    delete process.env.ADMIN_TOKEN;

    assert.strictEqual(verifyAdminToken(req), false);
  });

  test('gallery passphrase-derived token must not grant admin access', () => {
    // The gallery unlock token (verifyToken) and admin token are separate credentials;
    // a valid gallery JWT should never satisfy verifyAdminToken.
    const req = { headers: { authorization: 'Bearer some-jwt-gallery-token' } };
    process.env.ADMIN_TOKEN = 'completely-different-admin-secret';

    assert.strictEqual(verifyAdminToken(req), false);
  });
});

// ============================================================================
// File Serving Tests
// ============================================================================

test('serveFile - serves file with correct headers', async () => {
  const testDir = path.join(tmpdir(), `serve-file-test-${Date.now()}-${Math.random()}`);
  await fs.mkdir(testDir, { recursive: true });

  try {
    const testFile = path.join(testDir, 'test.txt');
    const fileContent = 'Hello, World!';
    await fs.writeFile(testFile, fileContent);

    // Mock Express response object
    const res = {
      headersSent: false,
      headers: {},
      setHeader(key, value) {
        this.headers[key] = value;
      },
      send(data) {
        this.headersSent = true;
        this.body = data;
      },
    };

    await serveFile(testFile, 'test.txt', res);

    assert.ok(res.headersSent);
    assert.ok(res.headers['Content-Type']);
    assert.ok(res.headers['Content-Length']);
    assert.strictEqual(res.headers['Content-Disposition'], 'inline; filename="test.txt"');
  } finally {
    await fs.rm(testDir, { recursive: true, force: true });
  }
});

test('serveFile - handles different file types', async () => {
  const testDir = path.join(tmpdir(), `serve-file-test-${Date.now()}-${Math.random()}`);
  await fs.mkdir(testDir, { recursive: true });

  try {
    const jpgFile = path.join(testDir, 'test.jpg');
    await fs.writeFile(jpgFile, 'fake image data');

    const res = {
      headersSent: false,
      headers: {},
      setHeader(key, value) {
        this.headers[key] = value;
      },
      send() {
        this.headersSent = true;
      },
    };

    await serveFile(jpgFile, 'test.jpg', res);

    assert.ok(res.headers['Content-Type']);
    assert.ok(
      res.headers['Content-Type'].includes('image'),
      `Expected image MIME type, got ${res.headers['Content-Type']}`
    );
  } finally {
    await fs.rm(testDir, { recursive: true, force: true });
  }
});

test('serveFile - non-existent file throws error', async () => {
  const res = {
    headers: {},
    setHeader() {},
    send() {},
  };

  const nonExistentPath = path.join(tmpdir(), 'this-file-does-not-exist.txt');

  await assert.rejects(async () => {
    await serveFile(nonExistentPath, 'file.txt', res);
  });
});
