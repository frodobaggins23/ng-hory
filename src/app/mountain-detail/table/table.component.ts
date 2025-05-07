import { Component, Input, SimpleChanges } from '@angular/core';
import { MountainStateService } from '../../services/mountain-state.service';
import { CommonModule } from '@angular/common';

const COLUMNS = [
  'date',
  'img',
  'description',
  'duration',
  'distance',
  'heartRate',
];

@Component({
  selector: 'app-mountain-detail-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  constructor(private mountainStateService: MountainStateService) {}
  @Input() mountainName: string = '';
  mountainDetail!: ReturnType<MountainStateService['getCurrentMountain']>;
  columns = COLUMNS;

  getCurrentMountain() {
    this.mountainDetail = this.mountainStateService.getCurrentMountain();
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
