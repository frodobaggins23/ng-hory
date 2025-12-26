import { Component, effect, inject } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { HeroComponent } from './hero/hero.component';
import { StatsCardComponent } from './stats-card/stats-card.component';
import { MountainStats, StatisticsService } from '../../services/new-ui/statistics.service';
import { MountainStateService } from '../../services/mountain-state.service';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { HeartRatePipe } from '../../pipes/heartRate.pipe';
import { ElevationPipe } from '../../pipes/elevation.pipe';

@Component({
  selector: 'app-detail-page',
  imports: [
    NavComponent,
    HeroComponent,
    StatsCardComponent,
    DistancePipe,
    DurationPipe,
    HeartRatePipe,
    ElevationPipe,
  ],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
})
export class DetailPageComponent {
  public statisticsService = inject(StatisticsService);
  public mountainStateService = inject(MountainStateService);
  public currentMountainStats: MountainStats = {
    totalElevationGain: 0,
    totalDistance: 0,
    totalDuration: 0,
    avgHeartRate: 0,
    totalClimbs: 0,
  };

  constructor() {
    effect(() => {
      const mountainName = this.mountainStateService.mountainName();
      this.currentMountainStats = this.statisticsService.getStatsForMountain(mountainName);
    });
  }
}
