import { Injectable } from '@angular/core';
import { mountains } from '../../../data';
import { allClimbsMap } from '../../../data/climbs';
import { MountainName } from '../../../data/types';

type BasicStats = {
  mountainCount: number;
  climbCount: number;
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

  getStatsForMountain(mountainName: MountainName) {
    const climbs = allClimbsMap[mountainName] || [];
    const totalClimbs = climbs.length;
    const totalDistance = climbs.reduce((sum, climb) => sum + climb.distance, 0);
    const totalElevationGain = climbs.reduce((sum, climb) => sum + climb.elevationGain, 0);
    const totalDuration = climbs.reduce((sum, climb) => sum + climb.duration, 0);

    return {
      totalClimbs,
      totalDistance,
      totalElevationGain,
      totalDuration,
    };
  }
}
