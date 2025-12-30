import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-overlay.component.html',
  styleUrl: './image-overlay.component.scss',
})
export class ImageOverlayComponent {
  @Input() imageUrl: string = '';
  @Input() altText: string = 'Image preview';
  @Input() isVisible: boolean = false;
  @Input() images: string[] = [];
  @Input() showNavigation: boolean = true;
  @Output() closeOverlay = new EventEmitter<void>();
  @Output() navigateNext = new EventEmitter<void>();
  @Output() navigatePrev = new EventEmitter<void>();

  get hasMultipleImages(): boolean {
    return this.images.length > 1;
  }

  get canShowNavigation(): boolean {
    return this.showNavigation && this.hasMultipleImages;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeOverlay.emit();
  }

  @HostListener('document:keydown.arrowLeft')
  onArrowLeftArrow(): void {
    if (this.canShowNavigation) {
      this.navigatePrev.emit();
    }
  }

  @HostListener('document:keydown.arrowRight')
  onArrowRightArrow(): void {
    if (this.canShowNavigation) {
      this.navigateNext.emit();
    }
  }

  onPrevClick(): void {
    this.navigatePrev.emit();
  }

  onNextClick(): void {
    this.navigateNext.emit();
  }
}
