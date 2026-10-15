import { Component, effect, inject, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';

import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GalleryCryptoService } from '../../services/gallery-crypto.service';
import { ImageService } from '../../services/image.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unlock-gallery',
  imports: [IconComponent, FormsModule],
  templateUrl: './unlock-gallery.component.html',
  styleUrl: './unlock-gallery.component.scss',
})
export class UnlockGalleryComponent {
  private galleryCryptoService = inject(GalleryCryptoService);
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
        this.imageService
          .clearCache()
          .pipe(switchMap(() => from(this.galleryCryptoService.unlock(this.password()))))
          .subscribe(() => {
            this.isSubmitting.set(false);
            this.password.set('');
            this.goToHomeAndRefresh();
          });
      }
    });
  }

  goToHomeAndRefresh(): void {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
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
