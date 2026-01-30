import { Component, Input } from '@angular/core';

import { IconComponent } from '../../../icon/icon.component';
import { ClimbItemBadgeComponent } from '../climb-item-badge/climb-item-badge.component';
import { ClimbItemStatsComponent } from '../climb-item-stats/climb-item-stats.component';
import { CzechDatePipe } from '../../../../pipes/czech-date.pipe';
import { Climb } from '../../../../../data/types';

@Component({
  selector: 'app-climb-item-collapsed-content',
  imports: [IconComponent, ClimbItemBadgeComponent, ClimbItemStatsComponent, CzechDatePipe],
  templateUrl: './climb-item-collapsed-content.component.html',
  styleUrl: './climb-item-collapsed-content.component.scss',
  host: {
    class: 'block flex-1 min-w-0',
  },
})
export class ClimbItemCollapsedContentComponent {
  @Input() climb!: Climb;
  @Input() isNewest: boolean = false;
  @Input() expanded: boolean = false;
}
