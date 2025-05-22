import { Component } from '@angular/core';
import { TableComponent } from './table/table.component';
import { MapService } from '../services/map.service';
import { CommonModule } from '@angular/common';
import { MountainStateService } from '../services/mountain-state.service';

@Component({
  selector: 'app-mountain-detail',
  imports: [TableComponent, CommonModule],
  templateUrl: './mountain-detail.component.html',
  styleUrl: './mountain-detail.component.scss',
})
export class MountainDetailComponent {
  constructor(
    public mapService: MapService,
    public mountainStateService: MountainStateService
  ) {}
}
