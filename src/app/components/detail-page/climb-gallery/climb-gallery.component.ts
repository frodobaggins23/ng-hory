import { Component, Input, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../services/image.service';
import { OverlayService } from '../../../services/overlay.service';
import { Subject, takeUntil } from 'rxjs';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-climb-gallery',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './climb-gallery.component.html',
  styleUrl: './climb-gallery.component.scss',
})
export class ClimbGalleryComponent implements OnInit, OnDestroy {
  private imageService = inject(ImageService);
  private overlayService = inject(OverlayService);
  private destroy$ = new Subject<void>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  @Input() images: string[] = [];
  @Input() mountainName: string = '';
  @Input() imgFolder: string = '';

  loadedImages: Map<string, string> = new Map();
  currentIndex = 0;
  showLeftArrow = false;
  showRightArrow = false;

  ngOnInit() {
    this.preloadImages();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private preloadImages() {
    this.images.forEach(imageName => {
      this.imageService
        .getImageUrl(this.mountainName, imageName, this.imgFolder)
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          this.loadedImages.set(imageName, result.url);
          // Check for arrows after images start loading and potentially change container size
          setTimeout(() => this.updateArrowVisibility(), 100);
        });
    });
  }

  updateArrowVisibility() {
    if (!this.scrollContainer) return;
    const element = this.scrollContainer.nativeElement;
    this.showLeftArrow = element.scrollLeft > 0;
    this.showRightArrow = element.scrollLeft < element.scrollWidth - element.clientWidth - 5;
  }

  scroll(direction: 'left' | 'right') {
    if (!this.scrollContainer) return;
    const element = this.scrollContainer.nativeElement;
    const scrollAmount = element.clientWidth * 0.8;
    const targetScroll =
      direction === 'left' ? element.scrollLeft - scrollAmount : element.scrollLeft + scrollAmount;

    element.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  }

  openPreview(index: number): void {
    this.currentIndex = index;
    const imageUrl = this.loadedImages.get(this.images[this.currentIndex]);
    if (!imageUrl) return;

    this.overlayService.openImageOverlay({
      imageUrl: imageUrl,
      altText: `Gallery image ${index + 1}`,
      images: this.images,
      showNavigation: this.images.length > 1,
      onNavigateNext: () => this.navigate(1),
      onNavigatePrev: () => this.navigate(-1),
    });
  }

  private navigate(delta: number): void {
    this.currentIndex = (this.currentIndex + delta + this.images.length) % this.images.length;
    const imageName = this.images[this.currentIndex];
    const imageUrl = this.loadedImages.get(imageName);

    if (imageUrl) {
      this.overlayService.updateOverlayImage(imageUrl);
    } else {
      this.imageService
        .getImageUrl(this.mountainName, imageName, this.imgFolder)
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          this.loadedImages.set(imageName, result.url);
          this.overlayService.updateOverlayImage(result.url);
        });
    }
  }
}
