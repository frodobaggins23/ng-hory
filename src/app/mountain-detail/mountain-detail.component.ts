import { Component, Input } from '@angular/core';
import { TableComponent } from './table/table.component';
import { MapService } from '../services/map.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mountain-detail',
  imports: [TableComponent, CommonModule],
  templateUrl: './mountain-detail.component.html',
  styleUrl: './mountain-detail.component.scss',
})
export class MountainDetailComponent {
  @Input() mountain: string = '';
  constructor(public mapService: MapService) {}
}
