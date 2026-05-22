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

function distanceComparisonClaimKey(distance: number): string {
  if (distance > 270000) return 'claims.distance.high';
  if (distance > 200000) return 'claims.distance.medium-high';
  if (distance > 180000) return 'claims.distance.medium';
  if (distance > 90000) return 'claims.distance.low-medium';
  return 'claims.distance.low';
}

function elevationComparisonClaimKey(elevation: number): string {
  if (elevation > 17500) return 'claims.elevation.highest';
  if (elevation > 8848) return 'claims.elevation.everest';
  if (elevation > 4800) return 'claims.elevation.montblanc';
  if (elevation > 2900) return 'claims.elevation.gerlach';
  return 'claims.elevation.low';
}

function durationComparisonClaimKey(duration: number): string {
  const hours = duration / 3600;
  if (hours > 192) return 'claims.duration.8days';
  if (hours > 96) return 'claims.duration.4days';
  if (hours > 48) return 'claims.duration.2days';
  if (hours > 24) return 'claims.duration.1day';
  return 'claims.duration.low';
}

export function toStatsCards(
  yearStats: YearlyStat | null,
  t: (key: string, params?: Record<string, string | number>) => string
): StatsCardData[] {
  if (!yearStats) return [];

  return [
    {
      position: '1',
      color: 'orange',
      title: t('stats.cards.climbCount'),
      value: yearStats.totalClimbs.toString(),
      claim: t('stats.cards.forYear', { year: yearStats.year }),
    },
    {
      position: '2',
      color: 'amber',
      title: t('stats.cards.totalDistance'),
      value: distancePipe.transform(yearStats.totalDistance),
      claim: t(distanceComparisonClaimKey(yearStats.totalDistance)),
    },
    {
      position: '3',
      color: 'stone',
      title: t('stats.cards.totalTime'),
      value: durationPipe.transform(yearStats.totalDuration),
      claim: t(durationComparisonClaimKey(yearStats.totalDuration)),
    },
    {
      position: '4',
      color: 'rose',
      title: t('stats.cards.totalElevation'),
      value: elevationPipe.transform(yearStats.totalElevationGain),
      claim: t(elevationComparisonClaimKey(yearStats.totalElevationGain)),
    },
  ];
}

export function toMonthlyClimbCounts(yearStats: YearlyStat | null): number[] {
  if (!yearStats) return Array(12).fill(0);
  return yearStats.monthlyStats.map(month => month.totalClimbs);
}

export function toCumulativeElevation(yearStats: YearlyStat | null): number[] {
  if (!yearStats) return Array(12).fill(0);

  let cumulative = 0;
  return yearStats.monthlyStats.map(month => {
    cumulative += month.totalElevationGain;
    return cumulative;
  });
}

export function toInterimStats(yearStats: YearlyStat | null): InterimStats {
  if (!yearStats) {
    return { totalClimbs: 0, totalElevationGain: 0 };
  }

  return {
    totalClimbs: yearStats.totalClimbs,
    totalElevationGain: yearStats.totalElevationGain,
  };
}
