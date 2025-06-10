import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService, ImageLoadResult } from '../services/image.service';
import { GoogleDriveService, DriveImageMetadata } from '../services/google-drive.service';
import { ImageCacheService, CacheStats } from '../services/image-cache.service';

@Component({
  selector: 'app-drive-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="drive-test">
      <h2>Google Drive Integration Test</h2>
      
      <div class="test-section">
        <h3>1. Inspect Drive Folder</h3>
        <button (click)="inspectFolder()" [disabled]="loading">Inspect Folder</button>
        <div *ngIf="folderImages.length > 0">
          <p>Found {{ folderImages.length }} images:</p>
          <ul>
            <li *ngFor="let img of folderImages">
              {{ img.name }} ({{ img.size }} bytes)
              <button (click)="loadImage(img.name)" [disabled]="loading">Load This Image</button>
            </li>
          </ul>
        </div>
      </div>

      <div class="test-section">
        <h3>2. Image Loading Test</h3>
        <div *ngIf="loadedImage">
          <p>Image loaded: {{ loadedImage.fromCache ? 'FROM CACHE' : 'FROM DRIVE' }}</p>
          <p>Size: {{ loadedImage.size }} bytes</p>
          <img [src]="loadedImage.url" style="max-width: 400px; max-height: 300px;" alt="Test image">
        </div>
      </div>

      <div class="test-section">
        <h3>3. Cache Statistics</h3>
        <button (click)="getCacheStats()" [disabled]="loading">Get Cache Stats</button>
        <div *ngIf="cacheStats">
          <p>Total Images: {{ cacheStats.totalImages }}</p>
          <p>Total Size: {{ formatBytes(cacheStats.totalSize) }}</p>
          <p>Available Slots: {{ cacheStats.availableSlots }}</p>
        </div>
        <button (click)="clearCache()" [disabled]="loading" style="margin-left: 10px;">Clear Cache</button>
      </div>

      <div class="test-section">
        <h3>4. Error/Loading States</h3>
        <div *ngIf="loading" class="loading">Loading...</div>
        <div *ngIf="error" class="error">Error: {{ error }}</div>
      </div>
    </div>
  `,
  styles: [`
    .drive-test {
      padding: 20px;
      max-width: 800px;
    }
    
    .test-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    
    .test-section h3 {
      margin-top: 0;
      color: #333;
    }
    
    button {
      padding: 8px 16px;
      margin: 5px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
    
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .loading {
      color: #007bff;
      font-weight: bold;
    }
    
    .error {
      color: #dc3545;
      font-weight: bold;
    }
    
    img {
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-top: 10px;
    }
    
    ul {
      list-style-type: none;
      padding: 0;
    }
    
    li {
      padding: 5px 0;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class DriveTestComponent implements OnInit {
  folderImages: DriveImageMetadata[] = [];
  loadedImage: ImageLoadResult | null = null;
  cacheStats: CacheStats | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private imageService: ImageService,
    private driveService: GoogleDriveService,
    private cacheService: ImageCacheService
  ) {}

  ngOnInit() {
    console.log('DriveTestComponent initialized');
  }

  async inspectFolder() {
    this.loading = true;
    this.error = null;

    try {
      // Use the folder ID from the first mountain (Ještěd)
      const folderId = '1MuUHuE3PZd6s9y2x7qM6Ih8eN5c2FoIc';
      
      this.driveService.inspectFolder(folderId).subscribe({
        next: (result) => {
          this.folderImages = result.images;
          this.loading = false;
          console.log('Folder inspection successful:', result);
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
          console.error('Folder inspection failed:', err);
        }
      });
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  async loadImage(imageName: string) {
    this.loading = true;
    this.error = null;

    try {
      // Test with Ještěd mountain
      this.imageService.getImageUrl('Ještěd', imageName).subscribe({
        next: (result) => {
          this.loadedImage = result;
          this.loading = false;
          console.log('Image loaded successfully:', result);
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
          console.error('Image loading failed:', err);
        }
      });
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  async getCacheStats() {
    this.loading = true;
    this.error = null;

    try {
      this.cacheService.getCacheStats().subscribe({
        next: (stats) => {
          this.cacheStats = stats;
          this.loading = false;
          console.log('Cache stats:', stats);
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
          console.error('Cache stats failed:', err);
        }
      });
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  async clearCache() {
    this.loading = true;
    this.error = null;

    try {
      this.cacheService.clearCache().subscribe({
        next: () => {
          this.cacheStats = null;
          this.loadedImage = null;
          this.loading = false;
          console.log('Cache cleared successfully');
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
          console.error('Cache clear failed:', err);
        }
      });
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}