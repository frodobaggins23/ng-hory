import { Component, Input, SimpleChanges } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { MountainStateService } from '../../services/mountain-state.service';
import { OverlayService } from '../../services/overlay.service';
import { CommonModule } from '@angular/common';
import { ExpandIconComponent } from '../expand-icon/expand-icon.component';
import { ExpandContentComponent } from '../expand-content/expand-content.component';

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
export class TableComponent {
  constructor(
    private mountainStateService: MountainStateService,
    public imageService: ImageService,
    private overlayService: OverlayService
  ) {}
  @Input() mountainName: string = '';
  mountainDetail!: ReturnType<MountainStateService['getCurrentMountain']>;
  columns = COLUMNS;
  expandedColumn: number | null = null;

  getCurrentMountain() {
    this.mountainDetail = this.mountainStateService.getCurrentMountain();
  }

  showThumbnail(id: number) {
    const climb = this.mountainDetail.climbs?.find((c) => c.id === id);
    if (climb && climb.imgs && climb.imgs.length > 0) {
      this.overlayService.openImageOverlay({
        imageUrl: this.imageService.getCdnUrl(climb.imgs[0]),
        altText: `Climb thumbnail for ${climb.date}`,
      });
    }
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
