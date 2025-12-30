import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackMapComponent } from '../../track-map/track-map.component';
import { ClimbGalleryComponent } from '../../climb-gallery/climb-gallery.component';
import { Climb } from '../../../../../data/types';

@Component({
  selector: 'app-climb-item-expanded-content',
  imports: [CommonModule, TrackMapComponent, ClimbGalleryComponent],
  templateUrl: './climb-item-expanded-content.component.html',
  styleUrl: './climb-item-expanded-content.component.scss',
  host: {
    class: 'block w-full',
  },
})
export class ClimbItemExpandedContentComponent {
  @Input() climb!: Climb;
  @Input() mountainName: string = '';
  @Input() imgFolder: string = '';
}
