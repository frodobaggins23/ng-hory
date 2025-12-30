import { Component, inject } from '@angular/core';
import { IconComponent } from '../../icon/icon.component';
import { MountainStateService } from '../../../services/mountain-state.service';
import { StatisticsService } from '../../../services/statistics.service';

@Component({
  selector: 'app-detail-page-hero',
  imports: [IconComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  public mountainStateService = inject(MountainStateService);
  public statisticsService = inject(StatisticsService);
}
