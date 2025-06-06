import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.scss'
})
export class PhotoGalleryComponent {
  constructor(public imageService: ImageService) {}

  @Input() images: string[] = [];
  currentIndex = 0;

  get hasImages(): boolean {
    return this.images.length > 0;
  }

  get hasMultipleImages(): boolean {
    return this.images.length > 1;
  }

  prev(): void {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  next(): void {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }
}
