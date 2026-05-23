import { Component, effect, inject, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { HeroComponent } from './hero/hero.component';
import { getCurrentYear } from '../../utils';
import { Router } from '@angular/router';
import { StatsCardContainerComponent } from './stats-card-container/stats-card-container.component';
import { RankingContainerComponent } from './ranking-container/ranking-container.component';
import { MonhtlyBarChartComponent } from './monhtly-bar-chart/monhtly-bar-chart.component';
import { CumulativeElevationChartComponent } from './cumulative-elevation-chart/cumulative-elevation-chart.component';
import { NotEnoughDataComponent } from './not-enough-data/not-enough-data.component';
import {
  StatisticsService,
  YearlyStat,
  MountainRankingStatByYear,
} from '../../services/statistics.service';
import {
  toStatsCards,
  toMonthlyClimbCounts,
  toCumulativeElevation,
  toInterimStats,
  StatsCardData,
  InterimStats,
} from './statistics-page.utils';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-statistics-page',
  imports: [
    NavComponent,
    HeroComponent,
    StatsCardContainerComponent,
    RankingContainerComponent,
    MonhtlyBarChartComponent,
    CumulativeElevationChartComponent,
    NotEnoughDataComponent,
  ],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss',
})
export class StatisticsPageComponent implements OnInit, OnChanges {
  @Input() year?: string;

  private router = inject(Router);
  private statisticsService = inject(StatisticsService);
  private translateService = inject(TranslateService);

  // Configuration flag - set to true to show full stats for current year
  private readonly SHOW_FULL_STATS_FOR_CURRENT_YEAR = true;

  // Raw service data
  yearlyStats: YearlyStat | null = null;
  rankings: MountainRankingStatByYear | null = null;

  // Transformed data for children
  statsCardsData: StatsCardData[] = [];
  monthlyChartData: number[] = [];
  cumulativeElevationData: number[] = [];
  interimStatsData: InterimStats = { totalClimbs: 0, totalElevationGain: 0 };

  // State flag
  showInterimView: boolean = false;

  get currentYear(): number {
    return getCurrentYear();
  }

  constructor() {
    effect(() => {
      if (this.yearlyStats && !this.showInterimView) {
        this.statsCardsData = toStatsCards(
          this.yearlyStats,
          this.translateService.get.bind(this.translateService)
        );
      }
    });
  }

  ngOnInit(): void {
    if (!this.year) {
      this.navigateToCurrentYear();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['year'] && this.year) {
      const parsedYear = parseInt(this.year);
      if (isNaN(parsedYear)) {
        this.navigateToCurrentYear();
        return;
      }
      this.loadYearData(parseInt(this.year));
    }
  }

  private navigateToCurrentYear(): void {
    this.router.navigate(['/stats', this.currentYear]);
  }

  private loadYearData(year: number): void {
    this.yearlyStats = this.statisticsService.getYearlyStats(year);
    this.rankings = this.statisticsService.getMountainRankingStatsForYear(year);

    this.showInterimView = this.shouldShowInterimView(year);

    if (this.showInterimView) {
      this.interimStatsData = toInterimStats(this.yearlyStats);
    } else {
      this.statsCardsData = toStatsCards(
        this.yearlyStats,
        this.translateService.get.bind(this.translateService)
      );
      this.monthlyChartData = toMonthlyClimbCounts(this.yearlyStats);
      this.cumulativeElevationData = toCumulativeElevation(this.yearlyStats);
    }
  }

  private shouldShowInterimView(year: number): boolean {
    const currentYear = getCurrentYear();
    const isCurrentYear = year === currentYear;

    if (!isCurrentYear) {
      return false;
    }

    return !this.SHOW_FULL_STATS_FOR_CURRENT_YEAR;
  }
}
