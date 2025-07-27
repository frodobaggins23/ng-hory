import { Component, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { ImageService, ImageLoadResult } from '../../services/image.service';
import { MountainStateService } from '../../services/mountain-state.service';
import { OverlayService } from '../../services/overlay.service';
import { CommonModule } from '@angular/common';
import { ExpandIconComponent } from '../expand-icon/expand-icon.component';
import { ExpandContentComponent } from '../expand-content/expand-content.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlobUtils } from '../../utils';

type Column = {
  name: string;
  onDesktopOnly: boolean;
  isLast?: boolean;
};

const COLUMNS: Column[] = [
  { name: 'date', onDesktopOnly: false },
  { name: 'img', onDesktopOnly: true },
  { name: 'description', onDesktopOnly: false },
  { name: 'distance', onDesktopOnly: true },
  { name: 'elevation', onDesktopOnly: true },
  { name: 'heartRate', onDesktopOnly: true },
  { name: 'duration', onDesktopOnly: false, isLast: true },
];

@Component({
  selector: 'app-mountain-detail-table',
  imports: [CommonModule, ExpandIconComponent, ExpandContentComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private thumbnailCache = new Map<number, { url: string; loading: boolean; error: boolean }>();

  constructor(
    private mountainStateService: MountainStateService,
    public imageService: ImageService,
    private overlayService: OverlayService
  ) {}

  @Input() mountainName: string = '';
  mountainDetail!: ReturnType<MountainStateService['getCurrentMountain']>;
  columns = COLUMNS;
  expandedColumn: number | null = null;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up blob URLs
    BlobUtils.revokeBlobUrlsFromMap(this.thumbnailCache);
  }

  getCurrentMountain() {
    this.mountainDetail = this.mountainStateService.getCurrentMountain();
    // Clear thumbnail cache when mountain changes
    this.thumbnailCache.clear();
    // Load thumbnails for visible climbs
    this.loadVisibleThumbnails();
  }

  private loadVisibleThumbnails() {
    if (!this.mountainDetail.climbs || !this.mountainName) return;
    
    this.mountainDetail.climbs.forEach(climb => {
      if (climb.imgs && climb.imgs.length > 0) {
        this.loadThumbnail(climb.id);
      }
    });
  }

  getThumbnailUrl(climbId: number): string {
    const cached = this.thumbnailCache.get(climbId);
    if (cached && !cached.loading && !cached.error) {
      return cached.url;
    }
    return '';
  }

  isThumbnailLoading(climbId: number): boolean {
    const cached = this.thumbnailCache.get(climbId);
    return cached?.loading || false;
  }

  hasThumbnailError(climbId: number): boolean {
    const cached = this.thumbnailCache.get(climbId);
    return cached?.error || false;
  }

  loadThumbnail(climbId: number) {
    const climb = this.mountainDetail.climbs?.find((c) => c.id === climbId);
    if (!climb || !climb.imgs || climb.imgs.length === 0 || !this.mountainName) {
      return;
    }

    // Check if already loading or loaded
    const cached = this.thumbnailCache.get(climbId);
    if (cached) {
      return;
    }

    // Set loading state
    this.thumbnailCache.set(climbId, { url: '', loading: true, error: false });

    // Load image from Drive
    const imageName = climb.imgs[0];
    this.imageService.getImageUrl(this.mountainName, imageName).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result: ImageLoadResult) => {
        this.thumbnailCache.set(climbId, { 
          url: result.url, 
          loading: false, 
          error: false 
        });
      },
      error: (error) => {
        console.error('Error loading thumbnail:', error);
        this.thumbnailCache.set(climbId, { 
          url: '', 
          loading: false, 
          error: true 
        });
      }
    });
  }

  showThumbnail(id: number) {
    const thumbnailUrl = this.getThumbnailUrl(id);
    const climb = this.mountainDetail.climbs?.find((c) => c.id === id);
    
    if (thumbnailUrl && climb && climb.imgs) {
      this.openImageOverlayWithNavigation(
        thumbnailUrl,
        climb,
        0
      );
    }
  }

  private openImageOverlayWithNavigation(
     imageUrl: string, 
     climb: any, 
     initialIndex: number
   ) {
     let currentIndex = initialIndex;
     
     const navigateToImage = (index: number) => {
       const imageName = climb.imgs[index];
       this.imageService.getImageUrl(this.mountainName, imageName).pipe(
         takeUntil(this.destroy$)
       ).subscribe({
         next: (result: ImageLoadResult) => {
           this.overlayService.updateOverlayImage(result.url);
         }
       });
     };
     
      this.overlayService.openImageOverlay({
       imageUrl: imageUrl,
       altText: `Climb image for ${climb.date}`,
       images: climb.imgs,
       showNavigation: climb.imgs.length > 1,
       onNavigateNext: () => {
         currentIndex = (currentIndex + 1) % climb.imgs.length;
         navigateToImage(currentIndex);
       },
       onNavigatePrev: () => {
         currentIndex = (currentIndex - 1 + climb.imgs.length) % climb.imgs.length;
         navigateToImage(currentIndex);
       }
     });
   }

  expandColumn(id: number) {
    this.expandedColumn = this.expandedColumn === id ? null : id;
  }

  ngOnInit() {
    this.getCurrentMountain();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mountainName'] && !changes['mountainName'].firstChange) {
      this.getCurrentMountain();
    }
  }
}
