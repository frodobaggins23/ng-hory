import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RxJSUtils } from '../utils';

export interface DriveImageMetadata {
  id: string;
  name: string;
  mimeType: string;
  size: number;
}

export interface DriveInspectionResult {
  folderId: string;
  images: DriveImageMetadata[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveService {
  private readonly API_BASE = 'https://www.googleapis.com/drive/v3';

  constructor() {}

  /**
   * Inspect a Drive folder and return all image metadata
   */
  inspectFolder(folderId: string): Observable<DriveInspectionResult> {
    const query = `mimeType contains 'image/' and '${folderId}' in parents`;
    const url =
      `${this.API_BASE}/files?` +
      `q=${encodeURIComponent(query)}&` +
      `fields=files(id,name,mimeType,size)&` +
      `pageSize=100&` +
      `key=${environment.googleDriveApiKey}`;

    return from(
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Drive API error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          const images: DriveImageMetadata[] = (data.files || []).map((file: any) => ({
            id: file.id,
            name: file.name,
            mimeType: file.mimeType,
            size: file.size ? parseInt(file.size) : 0,
          }));

          return {
            folderId,
            images,
            totalCount: images.length,
          };
        })
    ).pipe(catchError(RxJSUtils.logAndRethrow('Error inspecting Drive folder')));
  }

  /**
   * Download an image file as a Blob
   */
  downloadImage(fileId: string): Observable<Blob> {
    const url = `${this.API_BASE}/files/${fileId}?alt=media&key=${environment.googleDriveApiKey}`;

    return from(
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`Download error: ${response.status} ${response.statusText}`);
        }
        return response.blob();
      })
    ).pipe(catchError(RxJSUtils.logAndRethrow('Error downloading image')));
  }

  /**
   * Find image by name in a list (exact or partial match)
   */
  findImageByName(images: DriveImageMetadata[], searchName: string): DriveImageMetadata | null {
    // First try exact match
    let match = images.find(img => img.name === searchName);

    if (!match) {
      // Try partial match (case-insensitive)
      match = images.find(img => img.name.toLowerCase().includes(searchName.toLowerCase()));
    }

    return match || null;
  }
}
