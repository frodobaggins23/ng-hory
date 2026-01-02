import { Component, effect, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unlock-gallery',
  imports: [IconComponent, FormsModule, CommonModule],
  templateUrl: './unlock-gallery.component.html',
  styleUrl: './unlock-gallery.component.scss',
})
export class UnlockGalleryComponent {
  isLocked = signal(true);
  showPasswordInput = signal(false);
  isHovering = signal(false);
  password = signal('');
  isSubmitting = signal(false);

  constructor() {
    effect(() => {
      if (this.isSubmitting()) {
        console.log('Password entered:', this.password());
        //TODO: Implement actual unlock logic here
        this.isSubmitting.set(false);
        this.password.set('');
      }
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
