import { Injectable } from '@angular/core';
import { mountains } from '../../data';
import { allClimbs } from '../../data/climbs';

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
    const climbCount = allClimbs.length;

    return {
      mountainCount,
      climbCount,
    };
  }

  getBasicStats(): BasicStats {
    return this.basicStats;
  }
}
