import { Climb } from '../../data/types';

/**
 * Calculate seasonal heart rate offset to account for temperature effects
 * - Summer (Jun-Aug): -5 bpm (heat inflates HR)
 * - Spring/Fall (Mar-May, Sep-Nov): 0 bpm
 * - Winter (Dec-Feb): +3 bpm (cold suppresses HR)
 */
export function getSeasonalHROffset(dateStr: string): number {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1; // 1-12

  if (month >= 6 && month <= 8) {
    return -5; // summer
  } else if (month >= 12 || month <= 2) {
    return 3; // winter
  }
  return 0; // spring/fall
}

/**
 * Calculate VAM (Vertical Ascent Meters per hour)
 * VAM = elevationGain / (duration_in_seconds / 3600)
 */
export function calculateVAM(climb: Climb): number {
  const durationHours = climb.duration / 3600;
  return climb.elevationGain / durationHours;
}

/**
 * Calculate Climb Performance Index (CPI)
 *
 * Formula:
 * 1. Calculate Naismith equivalent pace: (elevationGain × 7 + distance) / duration
 *    - Naismith factor 7: 1m elevation ≈ 7m flat distance for trail activity
 *    - This accounts for BOTH vertical AND horizontal effort
 * 2. Adjust HR for seasonal bias
 * 3. Calculate efficiency = Naismith_pace / HR_adjusted (m/s per bpm)
 * 4. Scale to 0-100: (efficiency - 0.006) / 0.019 * 100
 *
 * Margins:
 * - 0 pts: 0.006 m/s/bpm (unreachable, below any real climb)
 * - 100 pts: 0.025 m/s/bpm (~50% above current best: Blaník sprint at 0.01655)
 *
 * Why Naismith instead of VAM?
 * Pure VAM is biased toward shorter routes (skipping flat approach artificially inflates VAM).
 * Naismith credits both vertical and horizontal progress, nearly eliminating route-length bias.
 *
 * Returns a value typically between 20-60 depending on climb difficulty and effort.
 */
export function calculateCPI(climb: Climb): number {
  const hrAdjusted = climb.heartRate + getSeasonalHROffset(climb.date);

  // Avoid division by zero or extreme values
  if (hrAdjusted <= 0) {
    return 0;
  }

  // Naismith equivalent distance: 1m elevation ≈ 7m flat (for trail activity)
  const naimithDistance = climb.elevationGain * 7 + climb.distance; // in meters
  const naimithPace = naimithDistance / climb.duration; // in m/s

  const efficiency = naimithPace / hrAdjusted; // m/s per bpm

  // Scale: (efficiency - 0.006) / 0.019 * 100, clamped to [0, 100]
  const raw = ((efficiency - 0.006) / 0.019) * 100;
  return Math.round(Math.max(0, Math.min(100, raw)));
}
