import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../services/image.service';
import { OverlayService } from '../services/overlay.service';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.scss'
})
export class PhotoGalleryComponent {
  constructor(
    public imageService: ImageService,
    private overlayService: OverlayService
  ) {}

  @Input() images: string[] = [];
  currentIndex = 0;

  get hasImages(): boolean {
    return this.images.length > 0;
  }

  get hasMultipleImages(): boolean {
    return this.images.length > 1;
  }

  get currentImageUrl(): string {
    return this.hasImages ? this.imageService.getCdnUrl(this.images[this.currentIndex]) : '';
  }

  prev(): void {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  next(): void {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  openPreview(): void {
    this.overlayService.openImageOverlay({
      imageUrl: this.currentImageUrl,
      altText: 'Gallery image preview'
    });
  }
}
