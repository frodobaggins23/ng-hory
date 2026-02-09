import { YearlyStat } from '../../services/statistics.service';
import { ElevationPipe } from '../../pipes/elevation.pipe';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';

export type ColorOption = 'orange' | 'amber' | 'rose' | 'stone';
export type CardPosition = '1' | '2' | '3' | '4';

export interface StatsCardData {
  title: string;
  value: string;
  claim: string;
  color: ColorOption;
  position: CardPosition;
}

export interface InterimStats {
  totalClimbs: number;
  totalElevationGain: number;
}

const elevationPipe = new ElevationPipe();
const distancePipe = new DistancePipe();
const durationPipe = new DurationPipe();

function distanceComparisonClaim(distance: number) {
  if (distance > 270000) {
    return 'Více než z Prahy do Aše';
  }

  if (distance > 200000) {
    return 'Více než z Prahy do Brna';
  }

  if (distance > 180000) {
    return 'Více než z Prahy na Sněžku';
  }

  if (distance > 90000) {
    return 'Více než z Prahy do Plzně';
  }

  return 'Méně než z Prahy do Plzně';
}

function elevationComparisonClaim(elevation: number) {
  if (elevation > 17500) {
    return 'Výškově více než výstup na K2 a Everest dohromady';
  }

  if (elevation > 8848) {
    return 'Výškově více než výstup na Mount Everest';
  }

  if (elevation > 4800) {
    return 'Výškově více než výstup na Mont Blanc';
  }

  if (elevation > 2900) {
    return 'Výškově více než výstup na Gerlachovský štít';
  }
  return 'Výškově méně než výstup na Gerlachovský štít';
}

function durationComparisonClaim(duration: number) {
  const hours = duration / 3600;
  if (hours > 192) {
    return 'Více než 8 dní v sedle';
  }

  if (hours > 96) {
    return 'Více než 4 dny v sedle';
  }

  if (hours > 48) {
    return 'Více než 2 dny v sedle';
  }

  if (hours > 24) {
    return 'Více než jeden den v sedle';
  }

  return 'Méně než jeden den v sedle';
}

/**
 * Transform YearlyStat to 4 stats cards for display
 */
export function toStatsCards(yearStats: YearlyStat | null): StatsCardData[] {
  if (!yearStats) return [];

  return [
    {
      position: '1',
      color: 'orange',
      title: 'Počet výstupů',
      value: yearStats.totalClimbs.toString(),
      claim: `Za rok ${yearStats.year}`,
    },
    {
      position: '2',
      color: 'amber',
      title: 'Celková vzdálenost',
      value: distancePipe.transform(yearStats.totalDistance),
      claim: distanceComparisonClaim(yearStats.totalDistance),
    },
    {
      position: '3',
      color: 'stone',
      title: 'Celkový čas',
      value: durationPipe.transform(yearStats.totalDuration),
      claim: durationComparisonClaim(yearStats.totalDuration),
    },
    {
      position: '4',
      color: 'rose',
      title: 'Celkové převýšení',
      value: elevationPipe.transform(yearStats.totalElevationGain),
      claim: elevationComparisonClaim(yearStats.totalElevationGain),
    },
  ];
}

/**
 * Extract monthly climb counts from yearly stats
 * Returns array of 12 numbers representing climbs per month
 */
export function toMonthlyClimbCounts(yearStats: YearlyStat | null): number[] {
  if (!yearStats) return Array(12).fill(0);
  return yearStats.monthlyStats.map(month => month.totalClimbs);
}

/**
 * Extract cumulative elevation from yearly stats
 * Returns array of 12 numbers representing cumulative elevation per month
 */
export function toCumulativeElevation(yearStats: YearlyStat | null): number[] {
  if (!yearStats) return Array(12).fill(0);

  let cumulative = 0;
  return yearStats.monthlyStats.map(month => {
    cumulative += month.totalElevationGain;
    return cumulative;
  });
}

/**
 * Extract interim stats for "not enough data" view
 */
export function toInterimStats(yearStats: YearlyStat | null): InterimStats {
  if (!yearStats) {
    return { totalClimbs: 0, totalElevationGain: 0 };
  }

  return {
    totalClimbs: yearStats.totalClimbs,
    totalElevationGain: yearStats.totalElevationGain,
  };
}
