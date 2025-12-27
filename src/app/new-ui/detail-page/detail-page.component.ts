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
import { ClimbHistoryComponent } from './climb-history/climb-history.component';
import { Climb } from '../../../data/types';

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
    ClimbHistoryComponent,
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

  public currentMountainClimbs: Climb[] = [];
  public currentMountainName: string = '';
  public currentImgFolder: string = '';

  constructor() {
    effect(() => {
      const mountain = this.mountainStateService.getCurrentMountain();
      this.currentMountainName = mountain.name;
      this.currentImgFolder = mountain.imgFolder;
      this.currentMountainStats = this.statisticsService.getStatsForMountain(mountain.name);
      this.currentMountainClimbs = [...(mountain.climbs || [])].reverse();
    });
  }
}
