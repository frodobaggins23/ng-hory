import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { homedir } from 'os';
import path from 'path';

const MAGICK_BIN = path.join(homedir(), 'Apps', 'magick', 'magick');
const RESIZE = '1500000@'; // Approx 1.5 megapixels
const QUALITY = '75';

export function assertMagickAvailable(): void {
  if (!existsSync(MAGICK_BIN)) {
    throw new Error(
      `ImageMagick binary not found at ${MAGICK_BIN}. Download and install it first.`
    );
  }
}

export interface CompressedImage {
  filename: string;
  path: string;
}

/**
 * Compresses each source photo to webp and renames it sequentially as
 * `<namePrefix>_01.webp`, `<namePrefix>_02.webp`, ... in the order given.
 */
export async function compressAndRenamePhotos(
  sourceFiles: string[],
  outputDir: string,
  namePrefix: string
): Promise<CompressedImage[]> {
  assertMagickAvailable();
  await mkdir(outputDir, { recursive: true });

  return sourceFiles.map((sourceFile, index) => {
    const filename = `${namePrefix}_${String(index + 1).padStart(2, '0')}.webp`;
    const destPath = path.join(outputDir, filename);

    execFileSync(MAGICK_BIN, [
      sourceFile,
      '-auto-orient',
      '-resize',
      RESIZE,
      '-quality',
      QUALITY,
      destPath,
    ]);

    return { filename, path: destPath };
  });
}
