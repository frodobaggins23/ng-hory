import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-hide-track-preview',
  imports: [CommonModule],
  templateUrl: './hide-track-preview.component.html',
  styleUrl: './hide-track-preview.component.scss',
})
export class HideTrackPreviewComponent {
  public mapService = inject(MapService);

  constructor() {
    effect(() => {
      console.log('isShowingTrackOnMap', this.mapService.isShowingTrackOnMap());
      this.isVisible = this.mapService.isShowingTrackOnMap();
    });
  }
  isVisible = false;
  hideTrackPreview() {
    this.mapService.hideTrack();
  }
}
