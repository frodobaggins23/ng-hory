import { Component, Input, SimpleChanges } from '@angular/core';
import { MountainStateService } from '../../services/mountain-state.service';
import { CommonModule } from '@angular/common';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';
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
  { name: 'heartRate', onDesktopOnly: true },
  { name: 'duration', onDesktopOnly: false, isLast: true },
];

@Component({
  selector: 'app-mountain-detail-table',
  imports: [
    CommonModule,
    ThumbnailComponent,
    ExpandIconComponent,
    ExpandContentComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  constructor(private mountainStateService: MountainStateService) {}
  @Input() mountainName: string = '';
  mountainDetail!: ReturnType<MountainStateService['getCurrentMountain']>;
  columns = COLUMNS;
  thumbnailId: number | null = null;
  expandedColumn: number | null = null;

  getCurrentMountain() {
    this.mountainDetail = this.mountainStateService.getCurrentMountain();
  }

  showThumbnail(id: number) {
    this.thumbnailId = id;
  }
  hideThumbnail() {
    this.thumbnailId = null;
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
