import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MapService } from '../../services/map.service';
import { Climb } from '../../../data/types';

@Component({
  selector: 'app-mountain-detail-expand-content',
  imports: [CommonModule],
  templateUrl: './expand-content.component.html',
  styleUrl: './expand-content.component.scss',
})
export class ExpandContentComponent {
  constructor(private mapService: MapService) {}
  @Input() expanded: boolean = false;
  @Input() content!: Climb;

  showTrack(geoJson: GeoJSON.GeoJsonObject) {
    this.mapService.showTrack(geoJson, true);
  }
}
