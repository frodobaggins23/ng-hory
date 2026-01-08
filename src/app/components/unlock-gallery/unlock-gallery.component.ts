import { Component, effect, inject, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../request.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TokenService } from '../../token.service';
import { ImageService } from '../../services/image.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

const UNLOCK_GALLERY_URL = `${environment.fileServerHost}/api/unlock-gallery`;

@Component({
  selector: 'app-unlock-gallery',
  imports: [IconComponent, FormsModule, CommonModule],
  templateUrl: './unlock-gallery.component.html',
  styleUrl: './unlock-gallery.component.scss',
})
export class UnlockGalleryComponent {
  private requestService = inject(RequestService);
  private tokenService = inject(TokenService);
  private imageService = inject(ImageService);
  private router = inject(Router);

  isLocked = signal(true);
  showPasswordInput = signal(false);
  isHovering = signal(false);
  password = signal('');
  isSubmitting = signal(false);

  constructor() {
    effect(() => {
      if (this.isSubmitting()) {
        console.log('Password entered:', this.password());
        this.imageService
          .clearCache()
          .pipe(switchMap(() => this.exchangePassphraseForToken(this.password())))
          .subscribe({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            next: (response: any) => {
              console.log('Response from unlock API:', response.token);
              this.tokenService.saveToken('GALLERY_TOKEN', response.token);
              this.isSubmitting.set(false);
              this.password.set('');
              this.goToHomeAndRefresh();
            },
            error: error => {
              console.error('Request failed:', error);
              this.isSubmitting.set(false);
              this.password.set('');
              this.goToHomeAndRefresh();
            },
          });
      }
    });
  }

  exchangePassphraseForToken(passphrase: string): Observable<unknown> {
    return this.requestService.request({
      method: 'post',
      path: UNLOCK_GALLERY_URL,
      payload: { passphrase },
      responseType: 'json',
      doNotAuthorize: true,
    });
  }

  goToHomeAndRefresh(): void {
    this.router.navigate(['/']);
  }

  onIconClick(): void {
    if (this.showPasswordInput()) {
      this.showPasswordInput.set(false);
      this.isLocked.set(true);
      this.password.set('');
    } else {
      this.showPasswordInput.set(true);
      this.isLocked.set(false);
    }
  }

  onSubmitPassword(): void {
    if (this.password()) {
      this.isLocked.set(true);
      this.showPasswordInput.set(false);
      this.isSubmitting.set(true);
    }
  }

  onMouseEnter(): void {
    if (!this.showPasswordInput()) {
      this.isHovering.set(true);
    }
  }

  onMouseLeave(): void {
    this.isHovering.set(false);
  }
}
