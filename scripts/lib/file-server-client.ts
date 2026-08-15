import { readFile } from 'fs/promises';
import type { CompressedImage } from './image-processor';

/**
 * Uploads already-compressed images to the file-server's admin-only endpoint.
 * Requires FILE_SERVER_ADMIN_TOKEN to match the ADMIN_TOKEN configured on the server.
 */
export async function uploadImagesToFileServer(
  fileServerHost: string,
  adminToken: string,
  folder: string,
  files: CompressedImage[]
): Promise<void> {
  const form = new FormData();
  form.set('folder', folder);

  for (const file of files) {
    const buffer = await readFile(file.path);
    form.append('files', new Blob([buffer]), file.filename);
  }

  const response = await fetch(`${fileServerHost}/api/upload-files`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: form,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Image upload to file-server failed (${response.status}): ${body}`);
  }
}
