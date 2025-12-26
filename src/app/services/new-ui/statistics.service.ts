import { Injectable } from '@angular/core';
import { mountains } from '../../../data';
import { allClimbsMap } from '../../../data/climbs';
import { MountainName } from '../../../data/types';

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

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  basicStats: BasicStats;

  constructor() {
    this.basicStats = this.calculateBasicStats();
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
    return this.basicStats;
  }

  getStatsForMountain(mountainName: MountainName): MountainStats {
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
}
