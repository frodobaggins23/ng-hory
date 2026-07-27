import { inject, Injectable, signal } from '@angular/core';
import { RequestService } from './request.service';
import { ImageService } from './services/image.service';
import { TokenService } from './token.service';
import { ConfigService } from './config/config.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private requestService = inject(RequestService);
  private imageService = inject(ImageService);
  private tokenService = inject(TokenService);
  private configService = inject(ConfigService);

  isGalleryLocked = signal(false);

  cleanUpGalleryOnInit = () => {
    const galleryToken = this.tokenService.getToken('GALLERY_TOKEN');
    if (galleryToken) {
      this.imageService.clearCache().subscribe();
      this.tokenService.removeToken('GALLERY_TOKEN');
    }
  };

  verifyGalleryToken() {
    const verifyTokenUrl = this.configService.buildApiUrl('verify-token');
    this.requestService
      .request({
        method: 'get',
        path: verifyTokenUrl,
      })
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
