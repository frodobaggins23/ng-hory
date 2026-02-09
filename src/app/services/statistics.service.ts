import { Injectable } from '@angular/core';
import { mountains } from '../../data';
import { allClimbsMap } from '../../data/climbs';
import { Climb, MountainName } from '../../data/types';
import { extractDataByKey, filterDataByKey, flatArrayFromMap, isDateInYear } from '../utils';

export type BasicStats = {
  mountainCount: number;
  climbCount: number;
};

export type MountainStats = {
  totalClimbs: number;
  totalDistance: number;
  totalElevationGain: number;
  totalDuration: number;
  avgHeartRate: number;
};

type MonthlyStat = {
  totalClimbs: number;
  totalDistance: number;
  totalElevationGain: number;
  totalDuration: number;
};

type MonthlyStats = MonthlyStat[] & { length: 12 };

export type YearlyStat = {
  year: number;
  totalClimbs: number;
  monthlyStats: MonthlyStats;
  totalDistance: number;
  totalElevationGain: number;
  totalDuration: number;
};

export type MountainRankingStat = {
  altitude: number;
  mountainName: MountainName;
  totalClimbs: number;
  totalElevationGain: number;
  totalElevationGainSharePercentage: number;
};

export type MountainRankingStatByYear = {
  year: number;
  rankings: MountainRankingStat[];
};

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  allClimbs: Climb[];
  basicStats: BasicStats | null = null;
  availableYears: number[] | null = null;
  yearlyStatsCache: Record<number, YearlyStat> = {};
  mountainRankingStatsCache: Record<number, MountainRankingStatByYear> = {};
  mountainStatsCache: Record<string, MountainStats> = {};

  constructor() {
    this.allClimbs = flatArrayFromMap(allClimbsMap);
  }

  private calculateBasicStats(): BasicStats {
    const mountainCount = mountains.length;
    const climbCount = Object.values(allClimbsMap).reduce(
      (total, climbs) => total + climbs.length,
      0
    );

    return {
      mountainCount,
      climbCount,
    };
  }

  getBasicStats(): BasicStats {
    if (!this.basicStats) {
      this.basicStats = this.calculateBasicStats();
    }
    return this.basicStats;
  }

  private calculateAvailableYears(): number[] {
    const dates = extractDataByKey(this.allClimbs, 'date');
    const yearsSet = new Set<number>();

    dates.forEach(dateStr => {
      const year = new Date(dateStr).getFullYear();
      yearsSet.add(year);
    });

    return Array.from(yearsSet).sort((a, b) => b - a);
  }

  getAvailableYears(): number[] {
    if (!this.availableYears) {
      this.availableYears = this.calculateAvailableYears();
    }
    return this.availableYears;
  }

  private calculateYearlyStats(year: number): YearlyStat {
    const climbsInYear = filterDataByKey(this.allClimbs, 'date', dateStr =>
      isDateInYear(dateStr, year)
    );

    const yearStats: Omit<YearlyStat, 'monthlyStats'> = {
      year,
      totalClimbs: climbsInYear.length,
      totalDistance: 0,
      totalElevationGain: 0,
      totalDuration: 0,
    };

    const monthlyStats = Array.from({ length: 12 }, () => ({
      totalClimbs: 0,
      totalDistance: 0,
      totalElevationGain: 0,
      totalDuration: 0,
    })) as MonthlyStats;

    climbsInYear.forEach(climb => {
      const date = new Date(climb.date);
      const month = date.getMonth();

      monthlyStats[month].totalClimbs += 1;
      monthlyStats[month].totalDistance += climb.distance;
      monthlyStats[month].totalElevationGain += climb.elevationGain;
      monthlyStats[month].totalDuration += climb.duration;

      yearStats.totalDistance += climb.distance;
      yearStats.totalElevationGain += climb.elevationGain;
      yearStats.totalDuration += climb.duration;
    });

    return {
      ...yearStats,
      monthlyStats: monthlyStats,
    };
  }

  getYearlyStats(year: number): YearlyStat {
    if (!this.yearlyStatsCache[year]) {
      this.yearlyStatsCache[year] = this.calculateYearlyStats(year);
    }
    return this.yearlyStatsCache[year];
  }

  private calculateMountainRankingStatsForYear(year: number): MountainRankingStatByYear {
    const sliceFirstN = 5;

    const rankingStats = mountains.map(mountain => {
      const climbs = filterDataByKey(allClimbsMap[mountain.name] || [], 'date', dateStr =>
        isDateInYear(dateStr, year)
      );
      const totalClimbs = climbs.length;
      const totalElevationGain = climbs.reduce((sum, climb) => sum + climb.elevationGain, 0);

      return {
        mountainName: mountain.name,
        totalClimbs,
        totalElevationGain,
        altitude: mountain.altitude,
      };
    });

    const topRankingStats = rankingStats
      .sort((a, b) => b.totalClimbs - a.totalClimbs || b.totalElevationGain - a.totalElevationGain)
      .slice(0, sliceFirstN);

    const totalElevationOfTopRankings =
      topRankingStats.reduce((sum, stat) => sum + stat.totalElevationGain, 0) || 1; // prevent division by zero

    const finalRankingStats = topRankingStats.map(stat => ({
      ...stat,
      totalElevationGainSharePercentage: stat.totalElevationGain / totalElevationOfTopRankings,
    }));

    return {
      year,
      rankings: finalRankingStats,
    };
  }

  getMountainRankingStatsForYear(year: number): MountainRankingStatByYear {
    if (!this.mountainRankingStatsCache[year]) {
      this.mountainRankingStatsCache[year] = this.calculateMountainRankingStatsForYear(year);
    }
    return this.mountainRankingStatsCache[year];
  }

  private calculateStatsForMountain(mountainName: MountainName): MountainStats {
    const climbs = allClimbsMap[mountainName] || [];
    const totalClimbs = climbs.length;
    const totalDistance = climbs.reduce((sum, climb) => sum + climb.distance, 0);
    const totalElevationGain = climbs.reduce((sum, climb) => sum + climb.elevationGain, 0);
    const totalDuration = climbs.reduce((sum, climb) => sum + climb.duration, 0);
    const avgHeartRate =
      climbs.reduce((sum, climb) => sum + (climb.heartRate || 0), 0) / climbs.length || 0;

    return {
      totalClimbs,
      totalDistance,
      totalElevationGain,
      totalDuration,
      avgHeartRate,
    };
  }

  getStatsForMountain(mountainName: MountainName): MountainStats {
    if (!this.mountainStatsCache[mountainName]) {
      this.mountainStatsCache[mountainName] = this.calculateStatsForMountain(mountainName);
    }
    return this.mountainStatsCache[mountainName];
  }
}
