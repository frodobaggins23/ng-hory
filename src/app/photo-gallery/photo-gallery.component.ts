import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { ImageService, ImageLoadResult } from '../services/image.service';
import { OverlayService } from '../services/overlay.service';

interface ImageState {
  url: string | null;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.scss'
})
export class PhotoGalleryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private imageStates = new Map<string, ImageState>();
  private currentImageState$ = new BehaviorSubject<ImageState>({
    url: null,
    loading: false,
    error: null,
    fromCache: false
  });

  constructor(
    private imageService: ImageService,
    private overlayService: OverlayService
  ) {}

  @Input() images: string[] = [];
  @Input() mountainName: string = '';
  currentIndex = 0;

  ngOnInit() {
    if (this.hasImages) {
      this.loadCurrentImage();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up blob URLs to prevent memory leaks
    this.imageStates.forEach(state => {
      if (state.url && state.url.startsWith('blob:')) {
        URL.revokeObjectURL(state.url);
      }
    });
  }

  get hasImages(): boolean {
    return this.images.length > 0;
  }

  get hasMultipleImages(): boolean {
    return this.images.length > 1;
  }

  get currentImageState(): ImageState {
    return this.currentImageState$.value;
  }

  get currentImageUrl(): string {
    return this.currentImageState.url || '';
  }

  get isLoading(): boolean {
    return this.currentImageState.loading;
  }

  get hasError(): boolean {
    return !!this.currentImageState.error;
  }

  private loadCurrentImage(): void {
    if (!this.hasImages || !this.mountainName) return;

    const imageName = this.images[this.currentIndex];
    const cached = this.imageStates.get(imageName);

    if (cached) {
      // Use cached state
      this.currentImageState$.next(cached);
      return;
    }

    // Set loading state
    const loadingState: ImageState = {
      url: null,
      loading: true,
      error: null,
      fromCache: false
    };
    this.currentImageState$.next(loadingState);

    // Load image from Drive
    this.imageService.getImageUrl(this.mountainName, imageName).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Error loading image:', error);
        return of({
          url: '',
          fromCache: false,
          error: error.message
        } as ImageLoadResult & { error: string });
      })
    ).subscribe(result => {
      const newState: ImageState = {
        url: result.url,
        loading: false,
        error: (result as any).error || null,
        fromCache: result.fromCache
      };

      // Cache the state
      this.imageStates.set(imageName, newState);
      this.currentImageState$.next(newState);
    });
  }

  prev(): void {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.loadCurrentImage();
  }

  next(): void {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.loadCurrentImage();
  }

  openPreview(): void {
    if (!this.currentImageUrl) return;
    
    this.overlayService.openImageOverlay({
      imageUrl: this.currentImageUrl,
      altText: 'Gallery image preview'
    });
  }

  retryLoad(): void {
    if (!this.hasImages) return;
    
    const imageName = this.images[this.currentIndex];
    this.imageStates.delete(imageName); // Clear cached error state
    this.loadCurrentImage();
  }
}
