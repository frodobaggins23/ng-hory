import 'dotenv/config';
import { webcrypto } from 'crypto';
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'fs/promises';
import path from 'path';
import { GALLERY_CANARY_PLAINTEXT, GALLERY_CRYPTO } from '../src/app/gallery-crypto.constants';

const { subtle } = webcrypto;

// Assumes invocation from the repo root, same as the rest of the npm scripts.
const REPO_ROOT = process.cwd();
const RAW_PHOTOS_DIR = path.join(REPO_ROOT, 'photos-raw');
const OUTPUT_DIR = path.join(REPO_ROOT, 'public/assets/gallery');

// Shown to visitors who haven't unlocked the gallery yet, so it has to stay
// plain/unencrypted rather than going through encryptBytes like everything
// else here.
const LOCKED_PLACEHOLDER_FILENAME = 'locked-gallery.webp';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Set it in your local .env file.`
    );
  }
  return value;
}

async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const baseKey = await subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: GALLERY_CRYPTO.salt,
      iterations: GALLERY_CRYPTO.iterations,
      hash: GALLERY_CRYPTO.hash,
    },
    baseKey,
    { name: 'AES-GCM', length: GALLERY_CRYPTO.keyLength },
    true,
    ['encrypt']
  );
}

async function encryptBytes(key: CryptoKey, plaintext: Uint8Array): Promise<Buffer> {
  const iv = webcrypto.getRandomValues(new Uint8Array(GALLERY_CRYPTO.ivLength));
  const ciphertext = await subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  return Buffer.concat([Buffer.from(iv), Buffer.from(ciphertext)]);
}

async function main() {
  const passphrase = requireEnv('GALLERY_PASSPHRASE');
  const key = await deriveKey(passphrase);

  // Wipe and recreate the output dir so renamed/removed raw photos don't
  // leave stale .enc files behind.
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  const canary = await encryptBytes(key, new TextEncoder().encode(GALLERY_CANARY_PLAINTEXT));
  await writeFile(path.join(OUTPUT_DIR, 'canary.enc'), canary);

  try {
    await copyFile(
      path.join(RAW_PHOTOS_DIR, LOCKED_PLACEHOLDER_FILENAME),
      path.join(OUTPUT_DIR, LOCKED_PLACEHOLDER_FILENAME)
    );
  } catch {
    console.warn(
      `Warning: ${LOCKED_PLACEHOLDER_FILENAME} not found in ${RAW_PHOTOS_DIR} - locked visitors will see a broken image.`
    );
  }

  const folders = await readdir(RAW_PHOTOS_DIR, { withFileTypes: true });
  let fileCount = 0;

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;

    const folderPath = path.join(RAW_PHOTOS_DIR, folder.name);
    const outputFolderPath = path.join(OUTPUT_DIR, folder.name);
    await mkdir(outputFolderPath, { recursive: true });

    const files = await readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile()) continue;

      const plaintext = await readFile(path.join(folderPath, file.name));
      const encrypted = await encryptBytes(key, plaintext);
      await writeFile(path.join(outputFolderPath, `${file.name}.enc`), encrypted);
      fileCount++;
    }
  }

  console.log(`Encrypted ${fileCount} photo(s) into ${OUTPUT_DIR}`);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
