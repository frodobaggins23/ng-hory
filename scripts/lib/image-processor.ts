import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { copyFile, mkdir, unlink } from 'fs/promises';
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

  const results: CompressedImage[] = [];

  for (const [index, sourceFile] of sourceFiles.entries()) {
    const filename = `${namePrefix}_${String(index + 1).padStart(2, '0')}.webp`;
    const destPath = path.join(outputDir, filename);

    // ImageMagick's CLI does its own filename-pattern scanning (frame
    // selectors, glob-style matching) that can misfire on names with
    // parentheses/special characters - common in phone/app export names
    // like "WhatsApp Image ... (1).jpeg". Copying to a safe, plain-ASCII
    // temp name first sidesteps that entirely.
    const safeSourcePath = path.join(outputDir, `.src-${index + 1}${path.extname(sourceFile)}`);
    await copyFile(sourceFile, safeSourcePath);

    try {
      execFileSync(MAGICK_BIN, [
        safeSourcePath,
        '-auto-orient',
        '-resize',
        RESIZE,
        '-quality',
        QUALITY,
        destPath,
      ]);
    } finally {
      await unlink(safeSourcePath);
    }

    results.push({ filename, path: destPath });
  }

  return results;
}
