import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MapService } from '../../services/map.service';
import { Climb } from '../../../data/types';
import { PhotoGalleryComponent } from '../../photo-gallery/photo-gallery.component';

@Component({
  selector: 'app-mountain-detail-expand-content',
  imports: [CommonModule, PhotoGalleryComponent],
  templateUrl: './expand-content.component.html',
  styleUrl: './expand-content.component.scss',
})
export class ExpandContentComponent {
  constructor(private mapService: MapService) {}

  @Input() expanded: boolean = false;
  @Input() content!: Climb;

  get images(): string[] {
    return this.content?.imgs || [];
  }

  get hasImages(): boolean {
    return !!this.content?.imgs && this.content.imgs.length > 0;
  }

  get hasTrack(): boolean {
    return !!this.content?.track;
  }

  showTrack(geoJson: GeoJSON.GeoJsonObject) {
    this.mapService.showTrack(geoJson, true);
  }
}
