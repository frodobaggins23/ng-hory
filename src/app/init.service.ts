import { inject, Injectable, signal } from '@angular/core';
import { ImageService } from './services/image.service';
import { GalleryCryptoService } from './services/gallery-crypto.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  constructor() {}

  private imageService = inject(ImageService);
  private galleryCryptoService = inject(GalleryCryptoService);

  isGalleryLocked = signal(false);

  async verifyGalleryToken(): Promise<void> {
    await this.galleryCryptoService.restoreFromStorage();

    const locked = !this.galleryCryptoService.isUnlocked();
    this.isGalleryLocked.set(locked);

    if (locked) {
      this.imageService.clearCache().subscribe();
    }
  }
}
