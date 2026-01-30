import { Component, Input } from '@angular/core';

import { IconComponent } from '../../../icon/icon.component';
import { DistancePipe } from '../../../../pipes/distance.pipe';
import { DurationPipe } from '../../../../pipes/duration.pipe';
import { HeartRatePipe } from '../../../../pipes/heartRate.pipe';
import { ElevationPipe } from '../../../../pipes/elevation.pipe';
import { Climb } from '../../../../../data/types';

@Component({
  selector: 'app-climb-item-stats',
  imports: [IconComponent, DistancePipe, DurationPipe, HeartRatePipe, ElevationPipe],
  templateUrl: './climb-item-stats.component.html',
  styleUrl: './climb-item-stats.component.scss',
  host: {
    class: 'flex flex-wrap items-center',
  },
})
export class ClimbItemStatsComponent {
  @Input() climb!: Climb;
}
