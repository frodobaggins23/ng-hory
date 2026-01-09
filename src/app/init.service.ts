import { effect, inject, Injectable, signal } from '@angular/core';
import { RequestService } from './request.service';
import { environment } from '../environments/environment';
import { ImageService } from './services/image.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  constructor() {}

  private requestService = inject(RequestService);
  private imageService = inject(ImageService);
  private tokenService = inject(TokenService);

  isGalleryLocked = signal(false);

  private verifyTokenUrl = `${environment.fileServerHost}/api/verify-token`;

  cleanUpGalleryOnInit = () => {
    const galleryToken = this.tokenService.getToken('GALLERY_TOKEN');
    if (galleryToken) {
      this.imageService.clearCache().subscribe();
      this.tokenService.removeToken('GALLERY_TOKEN');
    }
  };

  verifyGalleryToken() {
    this.requestService
      .request({
        method: 'get',
        path: this.verifyTokenUrl,
      })
      .subscribe({
        next: (response: any) => {
          const valid = !!response?.valid;
          this.isGalleryLocked.set(!valid);
          if (!valid) {
            this.cleanUpGalleryOnInit();
          }
        },
        error: error => {
          console.error('Token verification failed:', error);
          this.isGalleryLocked.set(true);
        },
      });
  }
}
