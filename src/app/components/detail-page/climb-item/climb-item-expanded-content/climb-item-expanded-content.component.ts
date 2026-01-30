import { Component, inject, Input, OnInit } from '@angular/core';

import { TrackMapComponent } from '../../track-map/track-map.component';
import { ClimbGalleryComponent } from '../../climb-gallery/climb-gallery.component';
import { Climb } from '../../../../../data/types';
import { TracksService } from '../../../../tracks.service';

@Component({
  selector: 'app-climb-item-expanded-content',
  imports: [TrackMapComponent, ClimbGalleryComponent],
  templateUrl: './climb-item-expanded-content.component.html',
  styleUrl: './climb-item-expanded-content.component.scss',
  host: {
    class: 'block w-full',
  },
})
export class ClimbItemExpandedContentComponent implements OnInit {
  @Input() climb!: Climb;
  @Input() mountainName: string = '';
  @Input() imgFolder: string = '';

  private tracksService = inject(TracksService);
  public trackData: GeoJSON.GeoJsonObject | null = null;

  ngOnInit(): void {
    if (this.climb.trackPath) {
      this.tracksService.loadTrack(this.climb.trackPath).subscribe({
        next: trackData => {
          this.trackData = trackData;
        },
        error: err => {
          console.error('Failed to load track data:', err);
          this.trackData = null;
        },
      });
    }
  }
}
