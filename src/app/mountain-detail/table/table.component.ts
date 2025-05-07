import { Component, Input, SimpleChanges } from '@angular/core';
import { MountainStateService } from '../../services/mountain-state.service';
import { CommonModule } from '@angular/common';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';

type Column = {
  name: string;
  onMobile: boolean;
};

const COLUMNS: Column[] = [
  { name: 'date', onMobile: true },
  { name: 'img', onMobile: false },
  { name: 'description', onMobile: true },
  { name: 'duration', onMobile: true },
  { name: 'distance', onMobile: false },
  { name: 'heartRate', onMobile: false },
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
