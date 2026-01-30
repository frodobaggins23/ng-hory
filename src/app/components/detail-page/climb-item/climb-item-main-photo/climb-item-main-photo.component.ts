import { Component, Input } from '@angular/core';

import { IconComponent } from '../../../icon/icon.component';
import { ClimbItemBadgeComponent } from '../climb-item-badge/climb-item-badge.component';
import { Climb } from '../../../../../data/types';

@Component({
  selector: 'app-climb-item-main-photo',
  imports: [IconComponent, ClimbItemBadgeComponent],
  templateUrl: './climb-item-main-photo.component.html',
  styleUrl: './climb-item-main-photo.component.scss',
  host: {
    class: 'block',
  },
})
export class ClimbItemMainPhotoComponent {
  @Input() thumbnailUrl: string | null = null;
  @Input() climb!: Climb;
  @Input() isNewest: boolean = false;
}
