import { Component, Input } from '@angular/core';
import { InterimProgressCardComponent } from '../stats-card/interim-progress-card.component';
import { IconComponent } from '../../icon/icon.component';
import { ElevationPipe } from '../../../pipes/elevation.pipe';
import { InterimStats } from '../statistics-page.utils';

@Component({
  selector: 'app-statistics-not-enough-data',
  imports: [InterimProgressCardComponent, IconComponent, ElevationPipe],
  templateUrl: './not-enough-data.component.html',
  styleUrl: './not-enough-data.component.scss',
})
export class NotEnoughDataComponent {
  @Input() stats: InterimStats = { totalClimbs: 0, totalElevationGain: 0 };
}
