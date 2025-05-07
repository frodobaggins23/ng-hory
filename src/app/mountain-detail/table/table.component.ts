import { Component, Input, SimpleChanges } from '@angular/core';
import { MountainStateService } from '../../services/mountain-state.service';
import { CommonModule } from '@angular/common';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';

type Column = {
  name: string;
  onDesktopOnly: boolean;
};

const COLUMNS: Column[] = [
  { name: 'date', onDesktopOnly: false },
  { name: 'img', onDesktopOnly: true },
  { name: 'description', onDesktopOnly: false },
  { name: 'duration', onDesktopOnly: false },
  { name: 'distance', onDesktopOnly: true },
  { name: 'heartRate', onDesktopOnly: true },
];

@Component({
  selector: 'app-mountain-detail-table',
  imports: [CommonModule, ThumbnailComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  constructor(private mountainStateService: MountainStateService) {}
  @Input() mountainName: string = '';
  mountainDetail!: ReturnType<MountainStateService['getCurrentMountain']>;
  columns = COLUMNS;
  thumbnailId: number | null = null;

  getCurrentMountain() {
    this.mountainDetail = this.mountainStateService.getCurrentMountain();
  }

  showThumbnail(id: number) {
    this.thumbnailId = id;
  }
  hideThumbnail() {
    this.thumbnailId = null;
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
